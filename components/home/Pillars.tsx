import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export function Pillars() {
  return (
    <section style={{ padding: '80px 32px', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Big editorial heading */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Work of the Church
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#1B3A6B', lineHeight: '1.05', maxWidth: '700px' }}>
            We Preach<br />the Gospel<br />in Every Service.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-40px' }}>
            <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '400px', textAlign: 'right', lineHeight: '1.7' }}>
              At Unity AIC we are committed to the faithful preaching of Scripture —
              expository, Christ-centred, and practically applied to everyday life.
              Every sermon is an encounter with the living Word.
            </p>
          </div>
        </div>

       

        {/* Bottom — left text + right CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '64px', flexWrap: 'wrap', gap: '24px' }}>
          <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '420px', lineHeight: '1.7' }}>
            We don't just invite you to attend — we invite you to belong.
            Come as you are, and grow into who God is calling you to be.
          </p>
          <Link
            href="/about"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1B3A6B',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
            }}
          >
            About The Church →
          </Link>
        </div>

      </div>
    </section>
  )
}