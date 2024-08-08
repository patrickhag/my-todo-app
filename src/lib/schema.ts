import { z } from 'zod'

export const todoSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'Text is required' })
    .max(255, { message: 'Text is too long' })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Text can only contain alphanumeric characters and spaces',
    })
    .trim(),
  description: z
    .string()
    .min(10, { message: 'Description is required' })
    .max(300, { message: 'Description is too long' })
    .optional(),
  done: z.boolean().default(false),
})

export type todoData = z.infer<typeof todoSchema>
