import Link  from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-primary border-t border-accent/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center ring-2 ring-accent/40 shrink-0">
                <Image
                  src="/aiclogo.png"
                  alt="AIC Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-base font-bold text-white leading-tight">Unity AIC Church</p>
                <p className="text-[10px] text-accent font-medium tracking-widest uppercase">Africa Inland Church Kenya</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              A local church council under the Africa Inland Church Kenya, serving our community through worship, ministry, and fellowship.
            </p>
            {/* Gold rule */}
            <div className="w-10 h-0.5 bg-accent mt-5 rounded-full" />
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Home',       href: '/'           },
                { label: 'About Us',   href: '/about'      },
                { label: 'Events',     href: '/events'     },
                { label: 'Ministries', href: '/ministries' },
                { label: 'Gallery',    href: '/gallery'    },
                { label: 'Contact',    href: '/contact'    },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-accent transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member links */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Members
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Sign In',        href: '/login'    },
                { label: 'Register',       href: '/register' },
                { label: 'My Dashboard',   href: '/dashboard'},
                { label: 'Giving History', href: '/dashboard'},
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-accent transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mt-6 mb-4">
              AIC Kenya
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="https://www.aickenya.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 text-sm hover:text-accent transition-colors no-underline"
                >
                  AIC Kenya ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-accent/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Unity AIC Church. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Local Church Council · Africa Inland Church Kenya
          </p>
        </div>
      </div>
    </footer>
  )
}