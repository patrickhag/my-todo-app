import { uuid, text, boolean, pgTable } from 'drizzle-orm/pg-core'

export const todo = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  done: boolean('done').default(false).notNull(),
  text: text('text').notNull(),
  description: text('description'),
})
