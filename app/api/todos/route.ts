import { db } from '@/db/drizzle'
import { todo } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

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
