import {
  getAdminStats,
  getRecentMembers,
  getRecentContributions,
} from '@/lib/actions/dashboard'
import {
  Users,
  Church,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

function formatKES(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style:    'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-KE', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  }).format(new Date(date))
}

const ROLE_BADGE: Record<string, string> = {
  ADMIN:           'bg-blue-100 text-blue-700',
  FINANCE_OFFICER: 'bg-purple-100 text-purple-700',
  DEPT_HEAD:       'bg-amber-100 text-amber-700',
  MEMBER:          'bg-gray-100 text-gray-600',
}

const METHOD_BADGE: Record<string, string> = {
  CASH:          'bg-green-100 text-green-700',
  MPESA:         'bg-emerald-100 text-emerald-700',
  BANK_TRANSFER: 'bg-blue-100 text-blue-700',
  OTHER:         'bg-gray-100 text-gray-600',
}

export async function AdminDashboard() {
  const [stats, recentMembers, recentContributions] = await Promise.all([
    getAdminStats(),
    getRecentMembers(),
    getRecentContributions(),
  ])

  const netSurplus = stats.monthlyContributions - stats.monthlyExpenses

  const statCards = [
    {
      label:  'Total Members',
      value:  stats.totalMembers.toLocaleString(),
      icon:   Users,
      color:  'text-blue-600',
      bg:     'bg-blue-50',
      href:   '/members',
    },
    {
      label:  'Departments',
      value:  stats.totalDepartments.toLocaleString(),
      icon:   Church,
      color:  'text-amber-600',
      bg:     'bg-amber-50',
      href:   '/ministry',
    },
    {
      label:  'Contributions (Month)',
      value:  formatKES(stats.monthlyContributions),
      icon:   TrendingUp,
      color:  'text-green-600',
      bg:     'bg-green-50',
      href:   '/contributions',
    },
    {
      label:  'Expenses (Month)',
      value:  formatKES(stats.monthlyExpenses),
      icon:   TrendingDown,
      color:  'text-red-600',
      bg:     'bg-red-50',
      href:   '/expenses',
    },
  ]

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Page heading */}
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Overview</h2>
        <p className="text-sm text-muted mt-0.5">
          {new Intl.DateTimeFormat('en-KE', { month: 'long', year: 'numeric' }).format(new Date())}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="no-underline bg-white rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-md hover:border-primary/20 transition-all animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {card.label}
                </p>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-primary">
                {card.value}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Net surplus banner */}
      <div className={`rounded-xl border px-5 py-4 flex items-center justify-between gap-4 ${
        netSurplus >= 0
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
            Net Surplus — This Month
          </p>
          <p className={`font-display text-2xl font-bold ${
            netSurplus >= 0 ? 'text-green-700' : 'text-red-700'
          }`}>
            {formatKES(netSurplus)}
          </p>
        </div>
        <Link
          href="/reports"
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors no-underline shrink-0"
        >
          View reports <ArrowRight size={14} />
        </Link>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent members */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold text-primary">Recent Members</h3>
            <Link
              href="/members"
              className="text-xs font-medium text-accent hover:text-accent-dark transition-colors no-underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-muted text-sm">
                      No members yet
                    </td>
                  </tr>
                ) : (
                  recentMembers.map((member, i) => (
                    <tr
                      key={member.id}
                      className={`border-b border-border hover:bg-sunken transition-colors ${
                        i % 2 === 1 ? 'bg-[#F9FAFC]' : ''
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span className="font-medium text-[#111827] truncate max-w-[120px]">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_BADGE[member.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {member.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted text-xs">
                        {formatDate(member.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent contributions */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold text-primary">Recent Contributions</h3>
            <Link
              href="/contributions"
              className="text-xs font-medium text-accent hover:text-accent-dark transition-colors no-underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Method</th>
                </tr>
              </thead>
              <tbody>
                {recentContributions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-muted text-sm">
                      No contributions yet
                    </td>
                  </tr>
                ) : (
                  recentContributions.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-border hover:bg-sunken transition-colors ${
                        i % 2 === 1 ? 'bg-[#F9FAFC]' : ''
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-[#111827] truncate max-w-[120px]">
                        {c.memberName}
                      </td>
                      <td className="px-5 py-3 font-semibold text-green-700">
                        {formatKES(Number(c.amount))}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${METHOD_BADGE[c.method] ?? 'bg-gray-100 text-gray-600'}`}>
                          {c.method.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-display text-base font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Add Member',      href: '/members/new',       emoji: '👤' },
            { label: 'Record Contribution', href: '/contributions/new', emoji: '💰' },
            { label: 'Log Expense',     href: '/expenses/new',      emoji: '📤' },
            { label: 'New Event',       href: '/events/new',        emoji: '🗓' },
            { label: 'Run Report',      href: '/reports',           emoji: '📊' },
            { label: 'Remittances',     href: '/remittances',       emoji: '📨' },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-sunken transition-all no-underline group"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-medium text-muted group-hover:text-primary transition-colors text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}