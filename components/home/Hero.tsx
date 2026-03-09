"use client"

import Image from "next/image"
import Link  from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/church.jpg"
        alt="Unity AIC Church congregation"
        fill
        priority
        unoptimized
        className="object-cover object-center"
      />

      {/* Overlay — darker at bottom so text is always readable */}
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content — centered, max width, padded */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center gap-6">

        {/* Eyebrow */}
        <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
          Africa Inland Church Kenya
        </p>

        {/* Heading */}
        <h1 className="font-display font-bold text-white leading-tight
          text-4xl
          sm:text-5xl
          md:text-6xl">
          Welcome Home to<br />Faith and Community.
        </h1>

        {/* Subtext */}
        <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl">
          No matter where you are on your journey, you're welcome here.
          Whether you're seeking answers or looking for community,
          we invite you to join us.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3 rounded bg-accent text-primary font-bold text-sm text-center hover:bg-accent-light transition-colors no-underline"
          >
            Become a Member
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3 rounded border border-white/40 text-white font-semibold text-sm text-center hover:bg-white/10 transition-colors no-underline"
          >
            Connect With Us
          </Link>
        </div>

        {/* Service times — simple, inline */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 border-t border-white/15 pt-6 w-full">
            {[
              { day: 'Sunday',    time: '8:00 AM',  name: 'First Service'  },
              { day: 'Sunday',    time: '10:30 AM', name: 'Second Service' },
              { day: 'Wednesday', time: '6:30 PM',  name: 'Bible Study'    },
              { day: 'Friday',    time: '6:00 PM',  name: 'Prayer Night'   },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-semibold">{s.day}</span>
                  <span className="text-white font-bold">{s.time}</span>
                </div>
                <span className="text-white/40 mt-0.5">{s.name}</span>
              </div>
            ))}
          </div>

      </div>

    </section>
  )
}