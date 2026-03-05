'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { Plus }                    from 'lucide-react'
import { createFund, toggleFundActive } from '@/lib/actions/finance'

type Fund = {
  id:                 string
  name:               string
  type:               string
  description:        string | null
  targetAmount:       string | null
  isActive:           boolean
  totalContributions: number
  totalExpenses:      number
  balance:            number
}

const TYPE_BADGE: Record<string, string> = {
  TITHE:       'bg-blue-100 text-blue-700',
  OFFERING:    'bg-green-100 text-green-700',
  BUILDING:    'bg-amber-100 text-amber-700',
  BENEVOLENCE: 'bg-purple-100 text-purple-700',
  GENERAL:     'bg-gray-100 text-gray-600',
}

function formatKES(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)
}

export function FundsPage({ funds }: { funds: Fund[] }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm,  setShowForm]     = useState(false)
  const [error,     setError]        = useState('')
  const [form, setForm] = useState({ name: '', type: 'GENERAL', description: '', targetAmount: '' })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createFund({ ...form, targetAmount: form.targetAmount || undefined })
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setForm({ name: '', type: 'GENERAL', description: '', targetAmount: '' })
      router.refresh()
    })
  }

  function handleToggle(id: string, current: boolean, name: string) {
    if (!confirm(`${current ? 'Deactivate' : 'Activate'} fund "${name}"?`)) return
    startTransition(async () => {
      await toggleFundActive(id, current)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Funds</h2>
          <p className="text-sm text-muted mt-0.5">{funds.filter(f => f.isActive).length} active funds</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer self-start"
        >
          <Plus size={16} /> New Fund
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">New Fund</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Fund Name</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="General Offering Fund"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Type</label>
                <select title="Type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  {['TITHE','OFFERING','BUILDING','BENEVOLENCE','GENERAL'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Target Amount <span className="text-muted font-normal">(optional)</span></label>
                <input type="number" min={0} value={form.targetAmount}
                  onChange={e => setForm(p => ({ ...p, targetAmount: e.target.value }))}
                  placeholder="500000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Description <span className="text-muted font-normal">(optional)</span></label>
                <input title="Description" type="text" value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1 border-t border-border">
              <button type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Creating...' : 'Create Fund'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted hover:bg-sunken transition-colors cursor-pointer"
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Fund cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {funds.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-border p-12 text-center">
            <p className="font-display text-lg font-bold text-primary mb-1">No funds yet</p>
            <p className="text-sm text-muted">Create your first fund above</p>
          </div>
        ) : funds.map(fund => (
          <div key={fund.id} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-base font-bold text-primary">{fund.name}</p>
                {fund.description && <p className="text-xs text-muted mt-0.5">{fund.description}</p>}
              </div>
              <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[fund.type] ?? 'bg-gray-100 text-gray-600'}`}>
                {fund.type}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted mb-0.5">In</p>
                <p className="text-sm font-bold text-green-700">{formatKES(fund.totalContributions)}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Out</p>
                <p className="text-sm font-bold text-red-600">{formatKES(fund.totalExpenses)}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Balance</p>
                <p className={`text-sm font-bold ${fund.balance >= 0 ? 'text-primary' : 'text-danger'}`}>
                  {formatKES(fund.balance)}
                </p>
              </div>
            </div>

            {fund.targetAmount && (
              <div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Progress</span>
                  <span>{Math.min(100, Math.round((fund.totalContributions / Number(fund.targetAmount)) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.min(100, (fund.totalContributions / Number(fund.targetAmount)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleToggle(fund.id, fund.isActive, fund.name)}
              disabled={isPending}
              className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                fund.isActive
                  ? 'bg-red-50 text-danger hover:bg-red-100'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {fund.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}