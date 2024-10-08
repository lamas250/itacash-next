// categories.ts
import db from '@/db/drizzle';
import { categories, insertCategorySchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod'


const app = new Hono()
  .get('/',
    clerkMiddleware(),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const data = await db
        .select({
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          type: categories.type,
          parentCategoryId: categories.parentCategoryId
        })
        .from(categories)
        .where(eq(categories.userId, user.userId));

      return c.json({ data })
    })
  .post('/',
    clerkMiddleware(),
    zValidator('json', z.object({
      name: z.string(),
      icon: z.string(),
      type: z.string(),
      parentCategoryId: z.string().optional()
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { name, icon, type, parentCategoryId } = c.req.valid('json');

      const data = await db.insert(categories)
        .values({
          id: createId(),
          userId: user.userId,
          name,
          icon,
          type,
          parentCategoryId: parentCategoryId || null
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

      const data = await db.delete(categories)
        .where(
          and(
            eq(categories.userId, user.userId),
            inArray(categories.id, ids)
          )
        )
        .returning({
          id: categories.id
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
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          type: categories.type
        })
        .from(categories)
        .where(
          and(
            eq(categories.userId, user.userId),
            eq(categories.id, id)
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
    zValidator('json', insertCategorySchema.pick({
      name: true,
      icon: true,
      type: true
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

      const { name, icon, type } = c.req.valid('json');

      const data = await db.update(categories)
        .set({
          name,
          icon,
          type
        })
        .where(
          and(
            eq(categories.userId, user.userId),
            eq(categories.id, id)
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

      const data = await db.delete(categories)
        .where(
          and(
            eq(categories.userId, user.userId),
            eq(categories.id, id)
          )
        )
        .returning({
          id: categories.id
        });

      if (!data) {
        return c.json({ error: 'Not Found' }, 404)
      }

      return c.json({ data: data[0] });
    }
  )


export default app