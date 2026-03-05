import Link from 'next/link'

type OverviewRow = {
  serviceId:    string
  serviceTitle: string
  serviceType:  string
  serviceDate:  string
  count:        number
}

const TYPE_BADGE: Record<string, string> = {
  SUNDAY_SERVICE: 'bg-blue-100 text-blue-700',
  MIDWEEK:        'bg-purple-100 text-purple-700',
  PRAYER:         'bg-amber-100 text-amber-700',
  SPECIAL:        'bg-green-100 text-green-700',
}

const TYPE_LABEL: Record<string, string> = {
  SUNDAY_SERVICE: 'Sunday Service',
  MIDWEEK:        'Midweek',
  PRAYER:         'Prayer',
  SPECIAL:        'Special',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function AttendanceOverview({ data }: { data: OverviewRow[] }) {
  const total   = data.reduce((sum, r) => sum + r.count, 0)
  const average = data.length ? Math.round(total / data.length) : 0

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Attendance</h2>
        <p className="text-sm text-muted mt-0.5">Last {data.length} services</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5 border-t-4 border-t-primary">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Services Recorded</p>
          <p className="font-display text-3xl font-bold text-primary">{data.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 border-t-4 border-t-accent">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Total Attendance</p>
          <p className="font-display text-3xl font-bold text-primary">{total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 border-t-4 border-t-green-400">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Avg. per Service</p>
          <p className="font-display text-3xl font-bold text-primary">{average}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Present</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted text-sm">
                    No services yet — create one in the Services module
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.serviceId}
                    className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}
                  >
                    <td className="px-5 py-3 font-medium text-[#111827]">{row.serviceTitle}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[row.serviceType] ?? 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABEL[row.serviceType] ?? row.serviceType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted text-xs hidden sm:table-cell">
                      {formatDate(row.serviceDate)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-display font-bold text-primary text-lg">{row.count}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/services/${row.serviceId}`}
                        className="text-xs font-medium text-accent hover:text-accent-dark transition-colors no-underline"
                      >
                        View
                      </Link>
                    </td>
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