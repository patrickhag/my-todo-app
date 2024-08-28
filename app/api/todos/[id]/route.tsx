import { db } from '@/db/drizzle'
import { todo, users } from '@/db/schema'
import { todoSchema } from '@/lib/schema'
import { ParamType } from '@/types'
import { error } from 'console'
import { asc, eq, not } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: ParamType }) {
  try {
    const { id } = params
    const todos = await db
      .select()
      .from(todo)
      .orderBy(asc(todo.done))
      .where(eq(todo.userId, id))

    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch to-dos' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: ParamType }
) {
  try {
    const { id } = params

    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)

    if (user === undefined || user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { text, description } = await req.json()

    const existingTodo = await db.select().from(todo).where(eq(todo.text, text))

    if (existingTodo.length > 0) {
      return NextResponse.json(
        { message: 'Todo already exists. Add new instead!' },
        { status: 404 }
      )
    }

    const validation = todoSchema.safeParse({ text, description })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const newTodo = {
      userId: id,
      text,
      description,
      done: false,
    }

    await db.insert(todo).values(newTodo)

    return NextResponse.json({
      status: 201,
      message: 'Todo created successfully',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create a new to-do' },
      { status: 500 }
    )
  }
}

/* UPDATE TODO */
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

/* DELETE TODO */
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

// UPDATE STATUS
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

    const updateStatusOfTodo = await db
      .update(todo)
      .set({
        done: not(todo.done),
      })
      .where(eq(todo.id, id))
      .returning()

    if (updateStatusOfTodo.length > 0) {
      return NextResponse.json(
        { message: 'Todo status updated successfully!' },
        { status: 200 }
      )
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
