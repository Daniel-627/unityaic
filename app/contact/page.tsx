'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Copy, Check } from 'lucide-react'

const SERVICE_TIMES = [
  { day: 'Sunday',    services: ['8:00 AM — First Service', '10:30 AM — Second Service'] },
  { day: 'Wednesday', services: ['6:30 PM — Midweek Bible Study']                        },
  { day: 'Friday',    services: ['6:00 PM — Prayer Night']                               },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '28px', height: '28px', borderRadius: '6px',
        backgroundColor: copied ? '#D1FAE5' : '#F3F4F6',
        border: 'none', cursor: 'pointer', flexShrink: 0,
        color: copied ? '#065F46' : '#6B7280',
        transition: 'all 0.2s',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

export default function ContactPage() {
  return (
    <main>

      {/* Page header */}
      <div style={{ backgroundColor: '#1B3A6B', padding: '80px 32px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Get In Touch
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.05' }}>
            Contact Us.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '16px', maxWidth: '480px', lineHeight: '1.7' }}>
            We would love to hear from you. Reach out or visit us on Sunday.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '64px 32px', backgroundColor: '#F7F8FC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>

          {/* Contact details */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1B3A6B', marginBottom: '24px' }}>Find Us</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(27,58,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} color="#1B3A6B" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Address</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1B3A6B' }}>Unity AIC Church, Nairobi, Kenya</p>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(27,58,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={16} color="#1B3A6B" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Phone</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a
                      href="tel:+254700000000"
                      style={{ fontSize: '14px', fontWeight: '600', color: '#1B3A6B', textDecoration: 'none' }}
                    >
                      +254 700 000 000
                    </a>
                    <CopyButton text="+254700000000" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(27,58,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={16} color="#1B3A6B" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Email</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a
                      href="mailto:info@unityaic.org"
                      style={{ fontSize: '14px', fontWeight: '600', color: '#1B3A6B', textDecoration: 'none' }}
                    >
                      info@unityaic.org
                    </a>
                    <CopyButton text="info@unityaic.org" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Service times */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={16} color="#C9A84C" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1B3A6B' }}>Service Times</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SERVICE_TIMES.map(s => (
                <div
                  key={s.day}
                  style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}
                >
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '6px' }}>
                    {s.day}
                  </p>
                  {s.services.map(sv => (
                    <p key={sv} style={{ fontSize: '14px', fontWeight: '500', color: '#1B3A6B' }}>{sv}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Location note */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1B3A6B', marginBottom: '24px' }}>Visit Us</h2>
            <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #E5E7EB' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8', marginBottom: '16px' }}>
                We meet every Sunday at our church premises in Nairobi. New visitors are always welcome — come as you are.
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8', marginBottom: '20px' }}>
                If you need directions or have any questions before your first visit, don't hesitate to call or email us directly.
              </p>
              <a
                href="tel:+254700000000"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  backgroundColor: '#1B3A6B', color: '#ffffff',
                  padding: '12px 24px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '700', textDecoration: 'none',
                }}
              >
                <Phone size={14} /> Call Us
              </a>
            </div>
          </div>

        </div>
      </div>

    </main>
  )
}