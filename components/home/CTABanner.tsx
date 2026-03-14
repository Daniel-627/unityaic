import Link from "next/link"
import { FiCheckCircle } from "react-icons/fi"

export function CTABanner() {
  return (
    <section style={{ paddingTop: '80px', paddingBottom: '80px' }} className="py-16 px-8 bg-primary">

      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">
          You Are Welcome Here
        </p>
        <h2 className="text-4xl font-bold text-white">
          Become Part of Our Family
        </h2>
        <p className="text-lg text-white/70 mt-4">
          Whether you are new to faith or searching for a church home,
          Unity AIC welcomes you. We are a community that walks with you
          through every season of life.
        </p>
        <p className="text-lg text-white/70 mt-4">
          From the moment you walk through our doors, you will find people
          who genuinely care — ready to worship with you, pray with you,
          and grow with you in faith.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#C9A84C',
              color: '#1B3A6B',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
            }}
          >
            Register Now
          </Link>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            Contact Us
          </Link>
        </div>
        <p className="text-white/40 text-xs mt-6">
          📍 Unity AIC Church · Nairobi, Kenya
        </p>
      </div>

    </section>
  )
}