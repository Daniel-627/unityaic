import Link  from 'next/link'
import Image from 'next/image'
import { ArrowRight, Target, Eye, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <main>

      {/* Hero */}
      <section className="bg-primary py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">Our Story</span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">About Unity AIC</h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed">
            A church built on the foundation of God's Word, serving the community of Nairobi and beyond.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Our History</p>
                <h2 className="font-display text-3xl font-bold text-primary mb-4">Rooted in Faith</h2>
              </div>
              <div className="flex flex-col gap-4 text-muted text-sm leading-relaxed">
                <p>
                  Unity AIC Church is a congregation of the Africa Inland Church Kenya,
                  one of the largest evangelical denominations in East Africa with roots
                  going back to 1895.
                </p>
                <p>
                  Our local congregation has grown over the decades into a vibrant community
                  of believers committed to worship, discipleship, and service. We are part
                  of the CED (Christian Education Department) structure of AIC Kenya.
                </p>
                <p>
                  Today we continue that mission — planting the Word of God in hearts
                  and seeing lives transformed by the grace of Jesus Christ.
                </p>
              </div>
            </div>
            <div className="w-full aspect-square rounded-2xl bg-primary/5 border border-border flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center p-8">
                <Image src="/aiclogo.png" alt="AIC Logo" width={80} height={80} className="object-contain opacity-60" />
                <p className="font-display text-2xl font-bold text-primary/40">Est. 1895</p>
                <p className="text-xs text-muted">Africa Inland Church Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-4 sm:px-6 bg-[#F7F8FC]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Direction</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">Vision & Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon:  Eye,
                title: 'Our Vision',
                color: 'text-blue-600',
                bg:    'bg-blue-50',
                text:  'To be a Christ-centred church that transforms lives, families, and communities through the power of the Gospel.',
              },
              {
                icon:  Target,
                title: 'Our Mission',
                color: 'text-amber-600',
                bg:    'bg-amber-50',
                text:  'To make disciples of Jesus Christ through evangelism, discipleship, fellowship, worship, and service.',
              },
              {
                icon:  Heart,
                title: 'Our Values',
                color: 'text-rose-600',
                bg:    'bg-rose-50',
                text:  'Faith in Scripture, love for one another, integrity in all things, and a heart for the lost and the vulnerable.',
              },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                  <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-primary">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-border">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            Come worship with us
          </h2>
          <p className="text-muted text-sm">
            We meet every Sunday at 8:00 AM and 10:30 AM. You are welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors no-underline inline-flex items-center gap-2"
            >
              Join Us <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:bg-sunken transition-colors no-underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}