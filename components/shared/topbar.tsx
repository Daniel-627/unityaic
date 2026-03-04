'use client'

import { Menu } from 'lucide-react'

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="md:hidden h-14 bg-white border-b border-border flex items-center px-4 shrink-0 shadow-[0_1px_3px_rgba(27,58,107,0.08)]">
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:bg-sunken transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>
    </header>
  )
}