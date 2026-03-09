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
  if (!events.length) return null

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F7F8FC]">

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">

          <div>
            <p className="text-accent text-xs tracking-[0.25em] uppercase font-semibold mb-3">
              What's Coming
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
              Upcoming Events
            </h2>
          </div>

          <Link
            href="/events"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light"
          >
            View all events
            <ArrowRight size={15} />
          </Link>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {events.map((event, i) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition"
            >

              <div className={`h-1.5 ${
                i === 0 ? "bg-primary" :
                i === 1 ? "bg-accent" :
                "bg-green-400"
              }`} />

              <div className="p-6 space-y-4">

                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${TYPE_COLOR[event.type] ?? "bg-gray-100 text-gray-600"}`}>
                  {event.type}
                </span>

                <h3 className="font-display text-lg font-bold text-primary">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-muted">

                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-accent" />
                    {formatDate(event.startDate)}
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-accent" />
                      {event.location}
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