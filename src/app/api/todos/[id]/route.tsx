import { db } from '@/src/db/drizzle'
import { todo } from '@/src/db/schema'
import { todoSchema } from '@/src/lib/schema'
import { ParamType } from '@/src/lib/types'
import { eq, not } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: ParamType }) {
  try {
    const { id } = params
    const { text, description } = await req.json()

    const thisTodo = await db.select().from(todo).where(eq(todo.id, id))

    if (thisTodo.length === 0) {
      return NextResponse.json({ error: 'Todo Not Found' }, { status: 404 })
    }

    const validation = todoSchema.safeParse({ text, description })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updatedTodo = await db
      .update(todo)
      .set({
        text: text,
        description: description,
      })
      .where(eq(todo.id, id))
      .returning()

    if (updatedTodo.length > 0) {
      return NextResponse.json({
        message: 'Todo updated successfully',
        status: 200,
      })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamType }
) {
  try {
    const { id } = params

    const thisTodo = await db.select().from(todo).where(eq(todo.id, id))

    if (thisTodo.length === 0) {
      return NextResponse.json({ error: 'Todo Not Found' }, { status: 404 })
    }

    const deleteTodo = await db.delete(todo).where(eq(todo.id, id)).returning()

    if (deleteTodo.length > 0) {
      return NextResponse.json(
        { message: 'Todo successfully deleted' },
        { status: 200 }
      )
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: ParamType }
) {
  try {
    const { id } = params

    const thisTodo = await db.select().from(todo).where(eq(todo.id, id))

    if (thisTodo.length === 0) {
      return NextResponse.json({ error: 'Todo Not Found' }, { status: 404 })
    }

    await db
      .update(todo)
      .set({
        done: not(todo.done),
      })
      .where(eq(todo.id, id))
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
