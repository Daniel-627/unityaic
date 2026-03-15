'use client'

import Link            from 'next/link'
import Image           from 'next/image'
import { usePathname } from 'next/navigation'
import { X, LogOut }   from 'lucide-react'
import { signOut }     from 'next-auth/react'
import { useSession } from 'next-auth/react'

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',     href: '/dashboard',              icon: '▦' },
    ],
  },
  {
    group: 'Ministry',
    items: [
      { label: 'Members',       href: '/members',       icon: '👤' },
      { label: 'Departments',   href: '/ministry',      icon: '⛪' },
      { label: 'Services',      href: '/services',      icon: '📅' },
      { label: 'Events',        href: '/events',        icon: '🗓' },
      { label: 'Attendance',    href: '/attendance',    icon: '✓'  },
      { label: 'Gallery',       href: '/admin-gallery',       icon: '🖼'  },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Contributions', href: '/contributions', icon: '💰' },
      { label: 'Receipts',      href: '/receipts',      icon: '🧾' },
      { label: 'Expenses',      href: '/expenses',      icon: '📤' },
      { label: 'Funds',         href: '/funds',         icon: '🏦' },
      { label: 'Remittances',   href: '/remittances',   icon: '📨' },
    ],
  },
  {
    group: 'Reports',
    items: [
      { label: 'All Reports',   href: '/reports',       icon: '📊' },
    ],
  },
  {
    group: 'Settings',
    items: [
      { label: 'Settings',      href: '/settings',      icon: '⚙'  },
    ],
  },
]

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userName = session?.user?.name ?? 'Member'
  const userRole = session?.user?.role ?? 'MEMBER'
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex flex-col h-full">

      {/* Logo lockup */}
      <div className="flex items-center justify-between gap-3 px-4 py-5 border-b border-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 ring-2 ring-accent/50">
            <Image
              src="/aiclogo.png"
              alt="AIC Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-tight">
              Unity AIC
            </p>
            <p className="text-[10px] text-accent font-medium tracking-widest uppercase">
              Church Platform
            </p>
          </div>
        </div>

        {/* Close — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-1">
            <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-accent/70">
              {group.group}
            </p>
            {group.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm transition-all no-underline border-l-2',
                    active
                      ? 'bg-accent/15 text-white font-semibold border-accent'
                      : 'text-white/60 font-normal border-transparent hover:bg-white/10 hover:text-white/90',
                  ].join(' ')}
                >
                  <span className="w-4 text-center text-sm leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User pill + logout */}
      <div className="p-3 border-t border-accent/20">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/10 transition-colors">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-primary-dark shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">{userName}</p>
            <p className="text-[11px] text-white/40">{userRole}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-white/30 hover:text-white/80 transition-colors cursor-pointer p-1 rounded"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

    </div>
  )
}

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-primary border-r border-accent/20 sticky top-0 h-screen overflow-y-auto shrink-0">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-full w-64 bg-primary md:hidden',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <NavContent onClose={onMobileClose} />
      </aside>
    </>
  )
}