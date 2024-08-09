export { auth as middleware } from './auth'

export const config = {
  matcher: [
    '/todo',
    '/((?!api|_next/static|_next/image|favicon.ico|public/images/).*)',
  ],
}
