import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { subDays, parse, differenceInDays } from "date-fns";
import db from "@/db/drizzle";
import { and, sql, sum, eq, lte, gte, lt, desc } from "drizzle-orm";
import { categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      })
    ),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { from, to } = c.req.valid("query");
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        startDate: Date,
        endDate: Date,
        userId: string
      ) {
        return db
          .select({
            income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expense: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            remaining: sum(transactions.amount).mapWith(Number),
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
            )
          )
      }

      const [[currentPeriod], [lastPeriod]] = await Promise.all([
        fetchFinancialData(startDate, endDate, user.userId),
        fetchFinancialData(lastPeriodStart, lastPeriodEnd, user.userId),
      ]);

      const incomeChange = calculatePercentageChange(currentPeriod.income,lastPeriod.income);
      const expenseChange = calculatePercentageChange(currentPeriod.expense,lastPeriod.expense);
      const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining);

      const category = await db
        .select({
          name: categories.name,
          value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            eq(transactions.userId, user.userId),
            lt(transactions.amount, 0),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .groupBy(categories.name)
        .orderBy(desc(
          sql`SUM(ABS(${transactions.amount}))`
        ));

      const topCategories = category.slice(0, 3);
      const otherCategories = category.slice(3);
      const otherSum = otherCategories.reduce((acc, curr) => acc + curr.value, 0);

      const finalCategories = topCategories;
      if (otherCategories.length > 0) {
        finalCategories.push({ name: "Outros", value: otherSum });
      };

      const activeDays = await db
        .select({
          date: transactions.date,
          income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
          expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, user.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date);

      const days = fillMissingDays(
        activeDays,
        startDate,
        endDate
      );


      return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
          remainingChange,
          incomeAmount: currentPeriod.income,
          incomeChange,
          expenseAmount: currentPeriod.expense,
          expenseChange,
          categories: finalCategories,
          days
        }
      })
    }
)

export default app;