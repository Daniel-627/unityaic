import Link  from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-primary" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Gold accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-4 ring-accent/40 shadow-2xl">
          <Image
            src="/aiclogo.png"
            alt="Unity AIC Church"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>

        {/* Tag */}
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">
            Africa Inland Church Kenya
          </span>
          <div className="h-px w-8 bg-accent" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Unity AIC Church
          </h1>
          <p className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A community of faith rooted in the Word, united in worship,
            and committed to serving God and one another.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-primary font-bold text-sm hover:bg-accent-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 no-underline text-center"
          >
            Join Our Community
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/20 transition-all border border-white/20 no-underline text-center"
          >
            Learn More
          </Link>
        </div>

        {/* Service times */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-2">
          {[
            { day: 'Sunday',    time: '8:00 AM & 10:30 AM', label: 'Main Service'  },
            { day: 'Wednesday', time: '6:30 PM',             label: 'Midweek Study' },
            { day: 'Friday',    time: '6:00 PM',             label: 'Prayer Night'  },
          ].map(s => (
            <div key={s.day} className="text-center">
              <p className="text-accent text-xs font-semibold uppercase tracking-wider">{s.day}</p>
              <p className="text-white font-bold text-sm mt-0.5">{s.time}</p>
              <p className="text-white/50 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}