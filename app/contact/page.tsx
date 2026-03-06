'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const SERVICE_TIMES = [
  { day: 'Sunday',    services: ['8:00 AM — First Service', '10:30 AM — Second Service'] },
  { day: 'Wednesday', services: ['6:30 PM — Midweek Bible Study']                        },
  { day: 'Friday',    services: ['6:00 PM — Prayer Night']                               },
]

const CONTACT_INFO = [
  { icon: MapPin, label: 'Address',  value: 'Unity AIC Church, Nairobi, Kenya'    },
  { icon: Phone,  label: 'Phone',    value: '+254 700 000 000'                    },
  { icon: Mail,   label: 'Email',    value: 'info@unityaic.org'                   },
]

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmit] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // MVP: just show success — no backend
    setSubmit(true)
  }

  return (
    <main>

      {/* Hero */}
      <section className="bg-primary py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">Get In Touch</span>
            <div className="h-px w-8 bg-accent" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            We would love to hear from you. Reach out with any questions or visit us on Sunday.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — info */}
          <div className="flex flex-col gap-8">

            {/* Contact details */}
            <div>
              <h2 className="font-display text-2xl font-bold text-primary mb-6">Find Us</h2>
              <div className="flex flex-col gap-4">
                {CONTACT_INFO.map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-primary">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Service times */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary">Service Times</h3>
              </div>
              <div className="flex flex-col gap-3">
                {SERVICE_TIMES.map(s => (
                  <div key={s.day} className="flex flex-col gap-1 p-4 rounded-xl bg-[#F7F8FC] border border-border">
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider">{s.day}</p>
                    {s.services.map(sv => (
                      <p key={sv} className="text-sm font-medium text-primary">{sv}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Send a Message</h2>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                  ✓
                </div>
                <h3 className="font-display text-xl font-bold text-primary">Message Received</h3>
                <p className="text-sm text-muted max-w-xs">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => { setSubmit(false); setForm({ name: '', email: '', message: '' }) }}
                  className="text-sm font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-primary">Your Name</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Jane Wanjiku"
                    className="w-full px-3.5 py-3 rounded-xl border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-primary">Email Address</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-3 rounded-xl border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-primary">Message</label>
                  <textarea
                    required rows={5} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-3 rounded-xl border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors cursor-pointer mt-1"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}