import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { db } from './db/drizzle'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  adapter: DrizzleAdapter(db),
  providers: [Google, GitHub],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
})
