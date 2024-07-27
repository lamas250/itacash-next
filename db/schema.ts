import { date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories);

// export const transactions = pgTable('transaction', {
//   id: text('id').primaryKey(),
//   title: text('title').notNull(),
//   amount: integer('amount').notNull(),
//   userId: text('user_id').notNull(),
//   date: timestamp('date', { mode: 'date' }).notNull(),
//   createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
// });

