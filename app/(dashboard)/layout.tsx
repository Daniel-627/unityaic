'use client'

import { useState }   from 'react'
import { Sidebar }    from '@/components/shared/sidebar'
import { TopBar }     from '@/components/shared/topbar'
import { Providers }  from '@/components/providers'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen bg-background">
        <Providers>
          <Sidebar
            mobileOpen={sidebarOpen}
            onMobileClose={() => setSidebarOpen(false)}
          />
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <TopBar onMenuClick={() => setSidebarOpen(prev => !prev)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}