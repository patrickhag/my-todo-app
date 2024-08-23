import { signOut } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await signOut()
    return NextResponse.json({ message: 'Signed out successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message })
    }
  }
}
