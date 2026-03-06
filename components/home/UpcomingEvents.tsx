import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

type Event = {
  id:          string
  title:       string
  type:        string
  startDate:   string
  endDate:     string | null
  location:    string | null
  isPublished: boolean
}

const TYPE_COLOR: Record<string, string> = {
  GENERAL:    'bg-gray-100    text-gray-600',
  RALLY:      'bg-blue-100    text-blue-700',
  AGM:        'bg-purple-100  text-purple-700',
  CONFERENCE: 'bg-indigo-100  text-indigo-700',
  SPECIAL:    'bg-amber-100   text-amber-700',
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(d))
}

export function UpcomingEvents({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <section className="py-20 px-4 sm:px-6 bg-[#F7F8FC]">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              What's Coming
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors no-underline shrink-0"
          >
            View all events <ArrowRight size={14} />
          </Link>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group"
            >
              {/* Colour bar */}
              <div className={`h-1.5 w-full ${
                i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : 'bg-green-400'
              }`} />

              <div className="p-6 flex flex-col gap-4">
                {/* Type badge */}
                <span className={`self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_COLOR[event.type] ?? 'bg-gray-100 text-gray-600'}`}>
                  {event.type}
                </span>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                  {event.title}
                </h3>

                {/* Meta */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar size={14} className="shrink-0 text-accent" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin size={14} className="shrink-0 text-accent" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}