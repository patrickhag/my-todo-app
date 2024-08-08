import { db } from '@/src/db/drizzle'
import { todo } from '@/src/db/schema'
import { todoSchema } from '@/src/lib/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, description } = await req.json()

    const validation = todoSchema.safeParse({ text, description })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const newTodo = {
      text,
      description,
      done: false,
    }

    await db.insert(todo).values(newTodo)

    return NextResponse.json({ status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create a new to-do' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const todos = await db.select().from(todo)
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch to-dos' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await db.delete(todo).where(eq(todo.done, true))

    return NextResponse.json(
      { message: 'Deleted completed todos' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete completed todos' },
      { status: 500 }
    )
  }
}
