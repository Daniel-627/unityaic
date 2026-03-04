'use client'

import { PanelLeft } from 'lucide-react'

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="md:hidden h-10 bg-transparent flex items-center px-4 shrink-0">
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-muted hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Open sidebar"
      >
        <PanelLeft size={18} />
      </button>
    </header>
  )
}