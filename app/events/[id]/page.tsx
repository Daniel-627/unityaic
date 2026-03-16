import { getEventById } from '@/lib/actions/events'
import { urlFor }       from '@/sanity/lib/image'
import { notFound }     from 'next/navigation'
import Link             from 'next/link'
import { Calendar, MapPin, ArrowLeft, Users } from 'lucide-react'

function formatDate(d: string) {
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(d))
}

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event  = await getEventById(id)
  if (!event || !event.isPublished) notFound()

  const gallery = event.media?.gallery ?? []

  return (
    <main>

      {/* Banner */}
      {event.media?.banner ? (
        <div style={{ width: '100%', aspectRatio: '16/6', overflow: 'hidden', position: 'relative' }}>
          <img
            src={urlFor(event.media.banner).width(1400).height(525).fit('crop').url()}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))' }} />
        </div>
      ) : (
        <div style={{ backgroundColor: '#1B3A6B', height: '8px' }} />
      )}

      {/* Content */}
      <div style={{ padding: '48px 32px', backgroundColor: '#F7F8FC' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Back */}
          <Link
            href="/events"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}
          >
            <ArrowLeft size={14} /> Back to Events
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{
              display: 'inline-flex', padding: '4px 12px', borderRadius: '999px',
              fontSize: '11px', fontWeight: '600', backgroundColor: '#EEF3FA',
              color: '#1B3A6B', marginBottom: '16px',
            }}>
              {event.type}
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', color: '#1B3A6B', lineHeight: '1.1', marginBottom: '20px' }}>
              {event.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color="#C9A84C" />
                <span style={{ fontSize: '15px', color: '#374151' }}>{formatDate(event.startDate)}</span>
                {event.endDate && (
                  <span style={{ fontSize: '14px', color: '#9CA3AF' }}>→ {formatDate(event.endDate)}</span>
                )}
              </div>
              {event.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="#C9A84C" />
                  <span style={{ fontSize: '15px', color: '#374151' }}>{event.location}</span>
                </div>
              )}
              {event.capacity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={16} color="#C9A84C" />
                  <span style={{ fontSize: '15px', color: '#374151' }}>Capacity: {event.capacity}</span>
                </div>
              )}
              {event.departmentName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Organised by {event.departmentName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.8' }}>{event.description}</p>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1B3A6B', marginBottom: '16px' }}>
                Event Gallery
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {gallery.map((img: any) => (
                  <div key={img._key} style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img
                      src={urlFor(img).width(400).height(300).fit('crop').url()}
                      alt={img.caption ?? event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ backgroundColor: '#1B3A6B', borderRadius: '12px', padding: '28px 32px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Want to attend?</p>
            <h3 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px' }}>Join Us for This Event</h3>
            <Link
              href="/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#C9A84C', color: '#1B3A6B',
                padding: '12px 28px', borderRadius: '8px',
                fontSize: '14px', fontWeight: '700', textDecoration: 'none',
              }}
            >
              Register Now →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}