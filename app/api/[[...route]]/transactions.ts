// transactions.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list transactions'))
  .post('/', (c) => c.json('create an transaction', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app