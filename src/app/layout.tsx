import type { Metadata } from 'next'
import './globals.css'
import ReactQueryProvider from '../lib/ReactQueryProvider'
import AuthProvider from '../lib/Provider'
import { openSans } from './components/ui/fonts'

export const metadata: Metadata = {
  title: 'Todo App - Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={openSans.className}>
        <AuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
