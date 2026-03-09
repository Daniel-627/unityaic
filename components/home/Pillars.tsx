import Image from 'next/image'

export function Pillars() {
  return (
    <section className="py-24 px-4 sm:px-8 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — photo collage */}
          <div className="relative h-480px sm:h-540px ">
            {/* Main photo */}
            <div className="absolute top-0 left-0 w-[72%] h-[75%] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80"
                alt="Church community"
                fill
                className="object-cover"
              />
            </div>
            {/* Secondary photo */}
            <div className="absolute bottom-0 right-0 w-[52%] h-[50%] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"
                alt="Bible study"
                fill
                className="object-cover"
              />
            </div>
            {/* Gold accent badge */}
            <div className="absolute bottom-[46%] left-[66%] z-10 bg-accent text-primary px-4 py-3 rounded-xl shadow-lg">
              <p className="font-display text-2xl font-bold leading-none">1895</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 text-primary/70">Est.</p>
            </div>
          </div>

          {/* Right — text */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
                Work of the Church
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary leading-tight mb-5">
                We Preach the Gospel<br />in Every Service
              </h2>
              <p className="text-muted text-sm leading-relaxed border-l-4 border-accent/30 pl-4">
                At Unity AIC we are committed to the faithful preaching of Scripture —
                expository, Christ-centred, and practically applied to everyday life.
                Every sermon is an encounter with the living Word.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {[
                {
                  num:   '01',
                  title: 'Worship',
                  text:  'We gather every Sunday to encounter God through music, prayer, and preaching.',
                },
                {
                  num:   '02',
                  title: 'Word',
                  text:  'Scripture is our foundation. We teach it carefully and let it shape every decision.',
                },
                {
                  num:   '03',
                  title: 'Community',
                  text:  'From Youth to Men\'s Fellowship — we build real relationships for every season of life.',
                },
              ].map(p => (
                <div key={p.num} className="flex items-start gap-4 group">
                  <span className="font-display text-2xl font-bold text-border group-hover:text-accent/30 transition-colors leading-none shrink-0 mt-1">
                    {p.num}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-primary mb-1">{p.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="self-start flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors no-underline"
            >
              About The Church →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}