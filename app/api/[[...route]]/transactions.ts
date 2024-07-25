// transactions.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list transactions'))
app.post('/', (c) => c.json('create an transaction', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app