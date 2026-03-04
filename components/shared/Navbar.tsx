'use client'

import Link            from 'next/link'
import Image           from 'next/image'
import { usePathname } from 'next/navigation'
import { useState }    from 'react'
import { Menu, X }     from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { label: 'Home',       href: '/'           },
  { label: 'About',      href: '/about'      },
  { label: 'Events',     href: '/events'     },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Gallery',    href: '/gallery'    },
  { label: 'Contact',    href: '/contact'    },
]

export function Navbar() {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const userName = session?.user?.name ?? ''
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-[0_1px_3px_rgba(27,58,107,0.08)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center ring-2 ring-primary/20">
            <Image src="/aiclogo.png" alt="AIC Logo" width={28} height={28} className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold text-primary leading-tight">Unity AIC</p>
            <p className="text-[10px] text-muted font-medium tracking-widest uppercase">Church Platform</p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline',
                  active ? 'text-primary bg-sunken' : 'text-muted hover:text-primary hover:bg-sunken',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {!loading && (
            session ? (
              <>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white ring-2 ring-accent shrink-0">
                  {initials}
                </div>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-border hover:bg-sunken transition-colors no-underline"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-light transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-border hover:bg-sunken transition-colors no-underline"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-light transition-colors no-underline"
                >
                  Join us
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:bg-sunken transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={[
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline',
                  active ? 'text-primary bg-sunken font-semibold' : 'text-muted hover:text-primary hover:bg-sunken',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
            {!loading && (
              session ? (
                <>
                  {/* Mobile avatar + name */}
                  <div className="flex items-center gap-2.5 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white ring-2 ring-accent shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{userName}</p>
                      <p className="text-xs text-muted">{session.user.role}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-primary border border-border text-center hover:bg-sunken transition-colors no-underline"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => { setOpen(false); signOut({ callbackUrl: '/login' }) }}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary text-center hover:bg-primary-light transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-primary border border-border text-center hover:bg-sunken transition-colors no-underline"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary text-center hover:bg-primary-light transition-colors no-underline"
                  >
                    Join us
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}