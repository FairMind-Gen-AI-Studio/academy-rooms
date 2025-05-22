import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Meeting Room Booking',
  description: 'Book meeting rooms for your team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ThemeProvider defaultTheme="system" storageKey="meeting-room-theme">
        <html lang="en" className="h-full">
          <body className="h-full">
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  )
}
