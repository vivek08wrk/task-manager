import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Manage tasks and links offline with a minimal, responsive UI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-black via-neutral-gray to-black text-foreground">
        <div className="dot-matrix min-h-screen">
          <Navbar className="sticky-top" />
          <main className="container mx-auto max-w-4xl px-4 py-6 sm:py-8 safe-bottom">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
