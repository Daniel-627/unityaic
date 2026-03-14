import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export function CTABanner() {
  return (
    <section style={{ padding: '80px 32px', backgroundColor: '#1B3A6B' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Big editorial heading */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            You Are Welcome Here
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.05', maxWidth: '700px' }}>
            Become Part<br />of Our<br />Family.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-40px' }}>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '400px', textAlign: 'right', lineHeight: '1.7' }}>
              Whether you are new to faith or searching for a church home,
              Unity AIC welcomes you. We are a community that walks with
              you through every season of life.
            </p>
          </div>
        </div>

        

        {/* Bottom — left text + right buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '64px', flexWrap: 'wrap', gap: '24px' }}>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
            📍 Unity AIC Church · Nairobi, Kenya
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#C9A84C',
                color: '#1B3A6B',
                padding: '14px 32px',
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
                padding: '14px 32px',
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
        </div>

      </div>
    </section>
  )
}