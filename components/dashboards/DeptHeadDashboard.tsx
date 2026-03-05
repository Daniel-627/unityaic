import { getDeptHeadStats } from '@/lib/actions/dashboard'
import { auth }             from '@/lib/auth'
import { Users, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

const DEPT_LABELS: Record<string, string> = {
  YOUTH:             'Youth (JOY)',
  WOMENS_FELLOWSHIP: "Women's Fellowship",
  MENS_FELLOWSHIP:   "Men's Fellowship",
  SUNDAY_SCHOOL:     'Sunday School',
  CADET_STAR:        'Cadet / Star',
}

export async function DeptHeadDashboard() {
  const session = await auth()
  const data    = await getDeptHeadStats(session!.user.id)

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="font-display text-xl font-bold text-primary">No department assigned</p>
        <p className="text-sm text-muted">You have not been assigned as head of any department yet.</p>
      </div>
    )
  }

  const { department, rosterCount, upcomingEvents } = data

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-primary">
          {DEPT_LABELS[department.type] ?? department.name}
        </h2>
        <p className="text-sm text-muted mt-0.5">Department overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Roster</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={16} className="text-blue-600" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{rosterCount.toLocaleString()}</p>
          <p className="text-xs text-muted">Active members</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Upcoming Events</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Calendar size={16} className="text-amber-600" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{upcomingEvents.length}</p>
          <p className="text-xs text-muted">Scheduled ahead</p>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display text-base font-semibold text-primary">Upcoming Events</h3>
          <Link href="/events" className="text-xs font-medium text-accent hover:text-accent-dark no-underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {upcomingEvents.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted text-sm">No upcoming events</p>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-sunken transition-colors">
                <div>
                  <p className="text-sm font-semibold text-primary">{event.title}</p>
                  <p className="text-xs text-muted mt-0.5">{formatDate(event.startDate)}</p>
                </div>
                <span className="text-xs font-medium text-accent bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
                  {event.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-display text-base font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'View Roster',      href: '/ministry',     emoji: '👥' },
            { label: 'Mark Attendance',  href: '/attendance',   emoji: '✓'  },
            { label: 'New Event',        href: '/events/new',   emoji: '🗓' },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-sunken transition-all no-underline group"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-medium text-muted group-hover:text-primary transition-colors text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}