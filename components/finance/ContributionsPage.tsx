'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { Plus, Trash2 }            from 'lucide-react'
import { createContribution, deleteContribution } from '@/lib/actions/finance'

type Contribution = {
  id:            string
  amount:        string
  type:          string
  method:        string
  referenceNo:   string | null
  contributedAt: Date
  notes:         string | null
  memberName:    string
  memberId:      string
  fundName:      string
  fundId:        string
}

type Fund   = { id: string; name: string; isActive: boolean }
type Member = { id: string; name: string }

const TYPE_BADGE: Record<string, string> = {
  TITHE:    'bg-blue-100 text-blue-700',
  OFFERING: 'bg-green-100 text-green-700',
  PLEDGE:   'bg-purple-100 text-purple-700',
  DONATION: 'bg-amber-100 text-amber-700',
}

const METHOD_BADGE: Record<string, string> = {
  CASH:          'bg-green-100 text-green-700',
  MPESA:         'bg-emerald-100 text-emerald-700',
  BANK_TRANSFER: 'bg-blue-100 text-blue-700',
  OTHER:         'bg-gray-100 text-gray-600',
}

function formatKES(n: string | number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(Number(n))
}

function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export function ContributionsPage({
  contributions, funds, members, userId,
}: {
  contributions: Contribution[]
  funds:         Fund[]
  members:       Member[]
  userId:        string
}) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm,  setShowForm]     = useState(false)
  const [error,     setError]        = useState('')

  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    memberId: '', fundId: '', amount: '', type: 'OFFERING',
    method: 'CASH', referenceNo: '', contributedAt: today, notes: '',
  })

  const activeFunds = funds.filter(f => f.isActive)
  const total       = contributions.reduce((sum, c) => sum + Number(c.amount), 0)

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createContribution({
        ...form,
        referenceNo: form.referenceNo || undefined,
        notes:       form.notes       || undefined,
      }, userId)
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setForm({ memberId: '', fundId: '', amount: '', type: 'OFFERING', method: 'CASH', referenceNo: '', contributedAt: today, notes: '' })
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this contribution and its receipt?')) return
    startTransition(async () => {
      await deleteContribution(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Contributions</h2>
          <p className="text-sm text-muted mt-0.5">
            {contributions.length} records · {formatKES(total)} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer self-start"
        >
          <Plus size={16} /> Record Contribution
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">Record Contribution</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Member</label>
                <select title="Member" required value={form.memberId} onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">— Select member —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Fund</label>
                <select title="Fund" required value={form.fundId} onChange={e => setForm(p => ({ ...p, fundId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">— Select fund —</option>
                  {activeFunds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Amount (KES)</label>
                <input title="Amount" type="number" required min={1} value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="5000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Date</label>
                <input title="Date" type="date" required value={form.contributedAt}
                  onChange={e => setForm(p => ({ ...p, contributedAt: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Type</label>
                <select title="Type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  {['TITHE','OFFERING','PLEDGE','DONATION'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Method</label>
                <select title="Method" value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  {['CASH','MPESA','BANK_TRANSFER','OTHER'].map(m => <option key={m} value={m}>{m.replace('_',' ')}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Reference No <span className="text-muted font-normal">(optional)</span></label>
                <input title="Reference Number" type="text" value={form.referenceNo}
                  onChange={e => setForm(p => ({ ...p, referenceNo: e.target.value }))}
                  placeholder="MPESA code, cheque no..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Notes <span className="text-muted font-normal">(optional)</span></label>
                <input title="Notes" type="text" value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1 border-t border-border">
              <button type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Recording...' : 'Record & Generate Receipt'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted hover:bg-sunken transition-colors cursor-pointer"
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Fund</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Method</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {contributions.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted text-sm">No contributions recorded yet</td></tr>
              ) : contributions.map((c, i) => (
                <tr key={c.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                  <td className="px-5 py-3 font-medium text-[#111827]">{c.memberName}</td>
                  <td className="px-5 py-3 text-muted text-sm">{c.fundName}</td>
                  <td className="px-5 py-3 font-semibold text-green-700">{formatKES(c.amount)}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[c.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${METHOD_BADGE[c.method] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.method.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted text-xs hidden lg:table-cell">{formatDate(c.contributedAt)}</td>
                  <td className="px-5 py-3">
                    <button title="Delete Contribution" onClick={() => handleDelete(c.id)} disabled={isPending}
                      className="text-danger hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}