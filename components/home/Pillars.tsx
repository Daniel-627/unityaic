import Link from 'next/link'

export function Pillars() {
  return (
    <section className="py-24 px-4 sm:px-8 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — image card */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{ height: '480px', backgroundImage: "url('/church.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Est. badge — top right corner */}
            <div
              className="absolute top-4 right-4 rounded-xl shadow-lg"
              style={{ backgroundColor: '#C9A84C', padding: '12px 16px' }}
            >
              <p className="font-display text-2xl font-bold leading-none" style={{ color: '#1B3A6B' }}>1895</p>
              <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: '#1B3A6B', opacity: 0.7 }}>Est.</p>
            </div>
          </div>

          {/* Right — text */}
          <div className="flex flex-col gap-8">

            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">
                Work of the Church
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary leading-tight mb-5">
                We Preach the Gospel<br />in Every Service
              </h2>
              <p className="text-muted text-sm leading-relaxed pl-4 border-l-4 border-accent">
                At Unity AIC we are committed to the faithful preaching of Scripture —
                expository, Christ-centred, and practically applied to everyday life.
                Every sermon is an encounter with the living Word.
              </p>
            </div>

            <div className="flex flex-col gap-7">
              {[
                { num: '01', title: 'Worship',   text: 'We gather every Sunday to encounter God through music, prayer, and preaching.' },
                { num: '02', title: 'Word',       text: 'Scripture is our foundation. We teach it carefully and let it shape every decision.' },
                { num: '03', title: 'Community',  text: "From Youth to Men's Fellowship — we build real relationships for every season of life." },
              ].map(p => (
                <div key={p.num} className="flex items-start gap-4">
                  <span className="font-display text-2xl font-bold text-border leading-none shrink-0 mt-1">
                    {p.num}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-primary mb-1">{p.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button — fully inline styled, no Tailwind */}
            <div>
              <Link
                href="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1B3A6B',
                  color: '#ffffff',
                  padding: '12px 24px',
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
        </div>
      </div>
    </section>
  )
}