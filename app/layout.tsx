import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import { LenisProvider } from '@/components/LenisProvider'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FLAMINGEOS — Juwany Roman',
  description: 'Creator. Explorer. Entrepreneur. From Puerto Rico to the world.',
  openGraph: {
    title: 'FLAMINGEOS',
    description: 'Creator. Explorer. Entrepreneur.',
    url: 'https://flamingeos.com',
    siteName: 'FLAMINGEOS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@flamingeos',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
