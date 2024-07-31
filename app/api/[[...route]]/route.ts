import { z } from 'zod'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import transactions from './transactions'
import categories from './categories'
import summary from './summary'

import { HTTPException } from 'hono/http-exception'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: 'Internal error' }, 500)
})

const routes = app
  .route('/transactions', transactions)
  .route('/categories', categories)
  .route('/summary', summary)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;