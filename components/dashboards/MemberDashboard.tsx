import { getMemberStats } from '@/lib/actions/dashboard'
import { auth }           from '@/lib/auth'
import { ArrowRight }     from 'lucide-react'
import Link               from 'next/link'

function formatKES(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date | string) {
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

const TYPE_BADGE: Record<string, string> = {
  TITHE:    'bg-blue-100 text-blue-700',
  OFFERING: 'bg-green-100 text-green-700',
  PLEDGE:   'bg-purple-100 text-purple-700',
  DONATION: 'bg-amber-100 text-amber-700',
}

export async function MemberDashboard() {
  const session = await auth()
  const data    = await getMemberStats(session!.user.id)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-primary">
          Welcome, {session!.user.name?.split(' ')[0]}
        </h2>
        <p className="text-sm text-muted mt-0.5">
          {new Intl.DateTimeFormat('en-KE', { month: 'long', year: 'numeric' }).format(new Date())}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3 border-t-4 border-t-accent animate-fade-in">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Giving</p>
          <p className="font-display text-2xl font-bold text-primary">{formatKES(data.totalGiving)}</p>
          <p className="text-xs text-muted">All time</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3 border-t-4 border-t-primary animate-fade-in">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">My Departments</p>
          <p className="font-display text-2xl font-bold text-primary">{data.departments.length}</p>
          <p className="text-xs text-muted">Active memberships</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3 border-t-4 border-t-green-500 animate-fade-in">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Upcoming Events</p>
          <p className="font-display text-2xl font-bold text-primary">{data.upcomingEvents.length}</p>
          <p className="text-xs text-muted">Scheduled ahead</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My departments */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold text-primary">My Departments</h3>
          </div>
          <div className="divide-y divide-border">
            {data.departments.length === 0 ? (
              <p className="px-5 py-8 text-center text-muted text-sm">Not a member of any department yet</p>
            ) : (
              data.departments.map(dept => (
                <div key={dept.id} className="px-5 py-4 flex items-center gap-3 hover:bg-sunken transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">⛪</div>
                  <p className="text-sm font-medium text-primary">
                    {DEPT_LABELS[dept.type] ?? dept.name}
                  </p>
                </div>
              ))
            )}
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
            {data.upcomingEvents.length === 0 ? (
              <p className="px-5 py-8 text-center text-muted text-sm">No upcoming events</p>
            ) : (
              data.upcomingEvents.map(event => (
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
      </div>

      {/* Recent giving */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display text-base font-semibold text-primary">Recent Giving</h3>
          <Link href="/contributions" className="text-xs font-medium text-accent hover:text-accent-dark no-underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Method</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentGiving.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted text-sm">No giving records yet</td></tr>
              ) : (
                data.recentGiving.map((c, i) => (
                  <tr key={c.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[c.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatKES(Number(c.amount))}</td>
                    <td className="px-5 py-3 text-muted text-xs">{c.method.replace('_', ' ')}</td>
                    <td className="px-5 py-3 text-muted text-xs">{formatDate(c.contributedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}