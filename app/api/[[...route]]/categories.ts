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
        name: categories.name
      })
      .from(categories)
      .where(eq(categories.userId, user.userId));

    return c.json({ data })
  })
  .post('/',
    clerkMiddleware(),
    zValidator('json', insertCategorySchema.pick({
      name: true,
    })),
    async (c) => {
      const user = getAuth(c);

      if (!user?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { name } = c.req.valid('json');

      const data = await db.insert(categories)
        .values({
          id: createId(),
          userId: user.userId,
          name
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
  // .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app