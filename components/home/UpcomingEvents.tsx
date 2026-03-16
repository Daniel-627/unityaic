'use client'

import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'

type Event = {
  id:          string
  title:       string
  type:        string
  startDate:   string
  endDate:     string | null
  location:    string | null
  isPublished: boolean
  banner:      any
}

const TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  GENERAL:    { bg: '#F3F4F6', color: '#4B5563' },
  RALLY:      { bg: '#DBEAFE', color: '#1D4ED8' },
  AGM:        { bg: '#EDE9FE', color: '#7C3AED' },
  CONFERENCE: { bg: '#E0E7FF', color: '#4338CA' },
  SPECIAL:    { bg: '#FEF3C7', color: '#D97706' },
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(d))
}

const TOP_COLORS = ['#1B3A6B', '#C9A84C', '#166534']

export function UpcomingEvents({ events }: { events: Event[] }) {
  if (!events.length) return null

  return (
    <section style={{ padding: '80px 32px', backgroundColor: '#F7F8FC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '64px' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            What's Coming
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#1B3A6B', lineHeight: '1.05' }}>
              Upcoming<br />Events.
            </h2>
            <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '380px', textAlign: 'right', lineHeight: '1.7' }}>
              Join us for worship, fellowship, and ministry gatherings
              happening across Unity AIC Church.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {events.map((event, i) => {
            const badge = TYPE_COLOR[event.type] ?? { bg: '#F3F4F6', color: '#4B5563' }
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden',
                  height: '100%',
                }}>
                  {/* Banner or color bar */}
                  {event.banner ? (
                    <div style={{ aspectRatio: '16/7', overflow: 'hidden' }}>
                      <img
                        src={urlFor(event.banner).width(600).height(262).fit('crop').url()}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: '4px', backgroundColor: TOP_COLORS[i % TOP_COLORS.length] }} />
                  )}

                  <div style={{ padding: '24px' }}>
                    <span style={{
                      display: 'inline-flex', padding: '4px 12px',
                      borderRadius: '999px', fontSize: '11px', fontWeight: '600',
                      backgroundColor: badge.bg, color: badge.color,
                      marginBottom: '16px',
                    }}>
                      {event.type}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B3A6B', marginBottom: '16px', lineHeight: '1.4' }}>
                      {event.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Calendar size={14} color="#C9A84C" />
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{formatDate(event.startDate)}</span>
                    </div>
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color="#C9A84C" />
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href="/events"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#1B3A6B', color: '#ffffff',
              padding: '14px 32px', borderRadius: '8px',
              fontSize: '14px', fontWeight: '700', textDecoration: 'none',
            }}
          >
            View All Events →
          </Link>
        </div>
      </div>
    </section>
  )
}