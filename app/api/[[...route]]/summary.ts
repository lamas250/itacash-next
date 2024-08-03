import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { subMonths, startOfMonth, endOfMonth  } from "date-fns";
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
        month: z.string().optional(),
        year: z.string().optional(),
      })
    ),
    async (c) => {
      const user = getAuth(c);
      if (!user?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { month, year } = c.req.valid("query");

      const defaultTo = month && year ? new Date(`${year}-${month}-01`) : new Date();
      const firstDayOfMonth = startOfMonth(defaultTo);
      const lastDayOfMonth = endOfMonth(defaultTo);

      const firstDayOfLastMonth = startOfMonth(subMonths(defaultTo, 1));
      const lastDayOfLastMonth = endOfMonth(subMonths(defaultTo, 1));

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
        fetchFinancialData(firstDayOfMonth, lastDayOfMonth, user.userId),
        fetchFinancialData(firstDayOfLastMonth, lastDayOfLastMonth, user.userId),
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
            gte(transactions.date, firstDayOfMonth),
            lte(transactions.date, lastDayOfMonth)
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
            gte(transactions.date, firstDayOfMonth),
            lte(transactions.date, lastDayOfMonth)
          )
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date);

      const days = fillMissingDays(
        activeDays,
        firstDayOfMonth,
        lastDayOfMonth
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
        },
        t: {
          firstDayOfMonth,
          lastDayOfMonth,
          firstDayOfLastMonth,
          lastDayOfLastMonth
        }
      })
    }
)

export default app;