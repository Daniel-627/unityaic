import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title:       'Unity AIC Church',
  description: 'Church Management Platform — Unity AIC Church',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
