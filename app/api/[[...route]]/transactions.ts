// transactions.ts
import db from '@/db/drizzle';
import { transactions, insetTransactionSchema, categories } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod'
import { parse, subDays } from 'date-fns';


const app = new Hono()
  .get('/',
    clerkMiddleware(),
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { from, to } = c.req.valid('query');

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from ? parse(from, 'yyyy-MM-dd', new Date() ) : defaultFrom;
      const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

      const data = await db
        .select({
          id: transactions.id,
          category: categories.name,
          categoryIcon: categories.icon,
          categoryId: transactions.categoryId,
          title: transactions.title,
          amount: transactions.amount,
          date: transactions.date,
        })
        .from(transactions)
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            eq(transactions.userId, user.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
      )
      .orderBy(desc(transactions.date))

      return c.json({ data })
    })
  .post('/',
    clerkMiddleware(),
    zValidator('json', insetTransactionSchema.omit({
      id: true,
      userId: true,
      createdAt: true,
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json');

      const data = await db.insert(transactions)
        .values({
          id: createId(),
          userId: user.userId,
          ...values
        }).returning()

      return c.json({ data: data[0] });
    })
  .post('/bulk-delete',
    clerkMiddleware(),
    zValidator('json',
      z.object({
        ids: z.array(z.string())
      })
    ),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { ids } = c.req.valid('json');

      const data = await db.delete(transactions)
        .where(
          and(
            eq(transactions.userId, user.userId),
            inArray(transactions.id, ids)
          )
        )
        .returning({
          id: transactions.id
        });

      return c.json({ data });
    }
  )
  .get('/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing Id' }, 400)
      }

      const data = await db
        .select({
          id: transactions.id,
          categoryId: transactions.categoryId,
          title: transactions.title,
          amount: transactions.amount,
          date: transactions.date,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, user.userId),
            eq(transactions.id, id)
          )
      );

      if (!data) {
        return c.json({ error: 'Not Found' }, 404)
      }

      return c.json({ data: data[0] });
    }
  )
  .patch('/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    zValidator('json', insetTransactionSchema.omit({
      id: true,
      userId: true,
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing Id' }, 400)
      }

      const values = c.req.valid('json');

      const data = await db.update(transactions)
        .set(values)
        .where(
          and(
            eq(transactions.userId, user.userId),
            eq(transactions.id, id)
          )
        )
        .returning();

      if (!data) {
        return c.json({ error: 'Not Found' }, 404)
      }

      return c.json({ data: data[0] });
    }
)
  .delete('/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing Id' }, 400)
      }

      const data = await db.delete(transactions)
        .where(
          and(
            eq(transactions.userId, user.userId),
            eq(transactions.id, id)
          )
        )
        .returning({
          id: transactions.id
        });

      if (!data) {
        return c.json({ error: 'Not Found' }, 404)
      }

      return c.json({ data: data[0] });
    }
  )


export default app