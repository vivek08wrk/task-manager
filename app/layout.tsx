import './globals.css'
import type { Metadata, Viewport } from 'next'
import React from 'react'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Task Manager | CMF by Nothing',
  description: 'A minimal, futuristic task manager with glassmorphic design and offline support.',
  keywords: ['task manager', 'productivity', 'cmf', 'nothing phone', 'minimal design'],
  authors: [{ name: 'CMF Design Team' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Task Manager | CMF by Nothing',
    description: 'A minimal, futuristic task manager with glassmorphic design.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-cmf-black text-foreground overflow-x-hidden">
        <div className="relative min-h-screen">
          <div className="fixed inset-0 dot-matrix opacity-60" />
          <div className="fixed inset-0 gradient-mesh opacity-40" />
          
          <div className="relative z-10">
            <Navbar className="sticky-nav safe-top" />
            <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 safe-bottom">
              {children}
            </main>
          </div>
          
          <div className="fixed top-20 left-10 w-32 h-32 bg-cmf-orange/5 rounded-full blur-3xl animate-float" />
          <div className="fixed bottom-20 right-10 w-48 h-48 bg-cmf-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="fixed top-1/2 left-1/3 w-24 h-24 bg-cmf-blue-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>
      </body>
    </html>
  )
}
