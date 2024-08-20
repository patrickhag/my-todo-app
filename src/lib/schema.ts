import { nullable, z } from 'zod'

export const todoSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'Text is required' })
    .max(255, { message: 'Text is too long' })
    .trim(),
  description: z
    .string()
    .max(300, { message: 'Description is too long' })
    .optional(),
  done: z.boolean().default(false),
})

export type todoData = z.infer<typeof todoSchema>
