import { getFinanceStats, getRecentContributions } from '@/lib/actions/dashboard'
import { TrendingUp, TrendingDown, AlertCircle, Landmark, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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

const METHOD_BADGE: Record<string, string> = {
  CASH:          'bg-green-100 text-green-700',
  MPESA:         'bg-emerald-100 text-emerald-700',
  BANK_TRANSFER: 'bg-blue-100 text-blue-700',
  OTHER:         'bg-gray-100 text-gray-600',
}

export async function FinanceOfficerDashboard() {
  const [stats, recentContributions] = await Promise.all([
    getFinanceStats(),
    getRecentContributions(),
  ])

  const netSurplus = stats.monthlyContributions - stats.monthlyExpenses

  const statCards = [
    {
      label: 'Contributions (Month)',
      value: formatKES(stats.monthlyContributions),
      icon:  TrendingUp,
      color: 'text-green-600',
      bg:    'bg-green-50',
      href:  '/contributions',
    },
    {
      label: 'Expenses (Month)',
      value: formatKES(stats.monthlyExpenses),
      icon:  TrendingDown,
      color: 'text-red-600',
      bg:    'bg-red-50',
      href:  '/expenses',
    },
    {
      label: 'Pending Remittances',
      value: formatKES(stats.pendingRemittances),
      icon:  AlertCircle,
      color: 'text-amber-600',
      bg:    'bg-amber-50',
      href:  '/remittances',
    },
    {
      label: 'Active Funds',
      value: stats.totalFunds.toString(),
      icon:  Landmark,
      color: 'text-blue-600',
      bg:    'bg-blue-50',
      href:  '/funds',
    },
  ]

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Finance Overview</h2>
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
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-primary">{card.value}</p>
            </Link>
          )
        })}
      </div>

      {/* Net surplus */}
      <div className={`rounded-xl border px-5 py-4 flex items-center justify-between gap-4 ${
        netSurplus >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Net Surplus — This Month</p>
          <p className={`font-display text-2xl font-bold ${netSurplus >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatKES(netSurplus)}
          </p>
        </div>
        <Link href="/reports" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light no-underline shrink-0">
          View reports <ArrowRight size={14} />
        </Link>
      </div>

      {/* Recent contributions */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display text-base font-semibold text-primary">Recent Contributions</h3>
          <Link href="/contributions" className="text-xs font-medium text-accent hover:text-accent-dark no-underline flex items-center gap-1">
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
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentContributions.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted text-sm">No contributions yet</td></tr>
              ) : (
                recentContributions.map((c, i) => (
                  <tr key={c.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                    <td className="px-5 py-3 font-medium text-[#111827]">{c.memberName}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatKES(Number(c.amount))}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${METHOD_BADGE[c.method] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted text-xs">{formatDate(c.contributedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-display text-base font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Record Contribution', href: '/contributions/new', emoji: '💰' },
            { label: 'Log Expense',         href: '/expenses/new',      emoji: '📤' },
            { label: 'Remittances',         href: '/remittances',       emoji: '📨' },
            { label: 'Run Report',          href: '/reports',           emoji: '📊' },
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