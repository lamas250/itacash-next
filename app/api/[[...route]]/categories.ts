// categories.ts
import db from '@/db/drizzle';
import { categories } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';


const app = new Hono()
  .get('/',
    clerkMiddleware(),
    async (c) => {
    const user = getAuth(c);

    if (!user?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: 'Unauthorized' }, 401)
      })
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name
      })
      .from(categories)
    console.log('data', data);

    return c.json({ data })
  })
  // .post('/', (c) => c.json('create an category', 201))
  // .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app