'use client'

import { useState, useMemo } from 'react'
import { Calendar, MapPin, Search } from 'lucide-react'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

type Event = {
  id:             string
  title:          string
  type:           string
  startDate:      string
  endDate:        string | null
  location:       string | null
  capacity:       number | null
  isPublished:    boolean
  departmentName: string | null
  banner:         any
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  GENERAL:    { bg: '#F3F4F6', color: '#4B5563' },
  RALLY:      { bg: '#DBEAFE', color: '#1D4ED8' },
  AGM:        { bg: '#EDE9FE', color: '#7C3AED' },
  CONFERENCE: { bg: '#E0E7FF', color: '#4338CA' },
  SPECIAL:    { bg: '#FEF3C7', color: '#D97706' },
}

const TOP_COLORS = ['#1B3A6B', '#C9A84C', '#166534', '#7C3AED', '#D97706']
const EVENT_TYPES = ['ALL', 'GENERAL', 'RALLY', 'AGM', 'CONFERENCE', 'SPECIAL']

function formatDate(d: string) {
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(d))
}

function getMonthKey(d: string) {
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthKey(key: string) {
  const [year, month] = key.split('-')
  return new Intl.DateTimeFormat('en-KE', { month: 'long', year: 'numeric' })
    .format(new Date(Number(year), Number(month) - 1))
}

export function PublicEvents({ events }: { events: Event[] }) {
  const [search,     setSearch]     = useState('')
  const [activeType, setActiveType] = useState('ALL')

  const filtered = useMemo(() => {
    return events
      .filter(e => activeType === 'ALL' || e.type === activeType)
      .filter(e =>
        search === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.location ?? '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }, [events, activeType, search])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Event[]>>((acc, event) => {
      const key = getMonthKey(event.startDate)
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    }, {})
  }, [filtered])

  const monthKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <main>

      {/* Page header */}
      <div style={{ backgroundColor: '#1B3A6B', padding: '80px 32px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            What's Happening
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.05' }}>
              Events.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '380px', textAlign: 'right', lineHeight: '1.7' }}>
              Rallies, AGMs, conferences and special services — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E5E7EB', padding: '20px 32px', position: 'sticky', top: '64px', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EVENT_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                style={{
                  padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                  border: '1px solid', cursor: 'pointer',
                  backgroundColor: activeType === type ? '#1B3A6B' : '#ffffff',
                  color:           activeType === type ? '#ffffff' : '#6B7280',
                  borderColor:     activeType === type ? '#1B3A6B' : '#E5E7EB',
                }}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              style={{
                paddingLeft: '36px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '8px',
                border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px',
                outline: 'none', width: '100%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Events grouped by month */}
      <div style={{ padding: '48px 32px', backgroundColor: '#F7F8FC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {monthKeys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7280' }}>
              <p style={{ fontSize: '1.1rem' }}>No events found.</p>
            </div>
          ) : (
            monthKeys.map(monthKey => (
              <div key={monthKey} style={{ marginBottom: '56px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1B3A6B', whiteSpace: 'nowrap' }}>
                    {formatMonthKey(monthKey)}
                  </h2>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                  <span style={{ fontSize: '12px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {grouped[monthKey].length} event{grouped[monthKey].length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {grouped[monthKey].map((event, i) => {
                    const badge = TYPE_COLORS[event.type] ?? { bg: '#F3F4F6', color: '#4B5563' }
                    return (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #E5E7EB',
                          overflow: 'hidden',
                          height: '100%',
                            minHeight: '320px',
                        }}>
                         {/* Banner or color bar */}
                        {event.banner ? (
                        <div style={{ height: '220px', overflow: 'hidden' }}>
                            <img
                            src={urlFor(event.banner).width(600).height(440).fit('crop').url()}
                            alt={event.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                        ) : (
                        <div style={{ height: '220px', backgroundColor: TOP_COLORS[i % TOP_COLORS.length], opacity: 0.15 }} />
                        )}

                          <div style={{ padding: '20px' }}>
                            <span style={{
                              display: 'inline-flex', padding: '3px 10px',
                              borderRadius: '999px', fontSize: '11px', fontWeight: '600',
                              backgroundColor: badge.bg, color: badge.color,
                              marginBottom: '12px',
                            }}>
                              {event.type}
                            </span>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1B3A6B', marginBottom: '12px', lineHeight: '1.4' }}>
                              {event.title}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <Calendar size={13} color="#C9A84C" />
                              <span style={{ fontSize: '13px', color: '#6B7280' }}>{formatDate(event.startDate)}</span>
                            </div>
                            {event.location && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={13} color="#C9A84C" />
                                <span style={{ fontSize: '13px', color: '#6B7280' }}>{event.location}</span>
                              </div>
                            )}
                            {event.departmentName && (
                              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>{event.departmentName}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}