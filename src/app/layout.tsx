import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Developer Cheat Sheet',
  description: 'Personal cheat sheet for development commands and techniques',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
