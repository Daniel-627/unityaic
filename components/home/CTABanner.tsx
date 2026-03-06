import Link from 'next/link'

export function CTABanner() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-primary relative overflow-hidden">

      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">

        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">
            You Are Welcome Here
          </span>
          <div className="h-px w-8 bg-accent" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Become Part of Our Family
        </h2>

        <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
          Whether you are new to faith or looking for a church home,
          Unity AIC welcomes you. Register today and connect with
          a community that will walk with you.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-primary font-bold text-sm hover:bg-accent-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 no-underline text-center"
          >
            Register Now
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all border border-white/20 no-underline text-center"
          >
            Contact Us
          </Link>
        </div>

        {/* Location strip */}
        <p className="text-white/40 text-xs mt-2">
          📍 Unity AIC Church · Nairobi, Kenya
        </p>
      </div>
    </section>
  )
}