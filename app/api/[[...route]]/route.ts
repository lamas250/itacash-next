import { z } from 'zod'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

import transactions from './transactions'
import categories from './categories'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello',
  clerkMiddleware(),
  (c) => {
    const user = getAuth(c);

    if (!user?.userId) {
      return c.json({
        error: 'Unauthorized',
      })
    }
  return c.json({
    message: 'Hello Next.js!',
  })
  });

const routes = app.
  route('/transactions', transactions)
  .route('/categories', categories)

export default app
export type AppType = typeof routes


export const GET = handle(app)
export const POST = handle(app)