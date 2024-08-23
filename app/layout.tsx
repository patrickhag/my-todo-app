import type { Metadata } from 'next'
import './globals.css'
import ReactQueryProvider from '../lib/ReactQueryProvider'
import { openSans } from '../components/ui/fonts'
import AuthProvider from '../lib/AuthProvider'
import { Toaster } from '@/components/ui/toaster'

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
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
