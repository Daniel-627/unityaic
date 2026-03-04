import type { Metadata } from 'next'
import '@/app/globals.css'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title:       'Unity AIC Church',
  description: 'Church Management Platform — Unity AIC Church',
  icons: {
    icon: '/aiclogo.png',
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}