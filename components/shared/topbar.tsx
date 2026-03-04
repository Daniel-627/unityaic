'use client'

import { Bell, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/members':       'Members',
  '/ministry':      'Ministry Departments',
  '/services':      'Services',
  '/events':        'Events',
  '/attendance':    'Attendance',
  '/contributions': 'Contributions',
  '/receipts':      'Receipts',
  '/expenses':      'Expenses',
  '/funds':         'Funds',
  '/remittances':   'Remittances',
  '/reports':       'Reports',
  '/settings':      'Settings',
}

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname  = usePathname()
  const segment   = '/' + (pathname.split('/')[1] ?? '')
  const pageTitle = PAGE_TITLES[segment] ?? 'Unity AIC'

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-[0_1px_3px_rgba(27,58,107,0.08)]">

      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:bg-sunken transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>

        {/* Page title */}
        <h1 className="font-display text-[17px] font-bold text-primary tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Church name — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-border">
          <div className="w-0.5 h-4 bg-accent rounded-full" />
          <span className="text-xs md:text-sm text-muted font-medium">
            Unity AIC Church
          </span>
        </div>

        {/* Notification bell */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:bg-sunken hover:text-primary transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={15} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white cursor-pointer ring-2 ring-accent">
          U
        </div>
      </div>
    </header>
  )
}