import { relations } from 'drizzle-orm'
import { uuid, text, boolean, pgTable } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
})

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todo),
}))

export const todo = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  done: boolean('done').default(false).notNull(),
  text: text('text').notNull(),
  description: text('description'),
})

export const todosRelations = relations(todo, ({ one }) => ({
  author: one(users, {
    fields: [todo.id],
    references: [users.id],
  }),
}))
