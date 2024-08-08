import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { db } from './db/drizzle'

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  return {
    session: { strategy: 'jwt' },
    adapter: DrizzleAdapter(db),
    providers: [Google],
    callbacks: {
      authorized: async ({ auth }) => {
        return !!auth
      },
    },
    pages: {
      signIn: '/',
    },
  }
})
