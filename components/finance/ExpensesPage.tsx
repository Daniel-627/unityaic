'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { Plus, Trash2 }            from 'lucide-react'
import { createExpense, deleteExpense } from '@/lib/actions/finance'

type Expense = {
  id:          string
  title:       string
  category:    string
  amount:      string
  date:        string
  description: string | null
  fundName:    string
  fundId:      string
  approvedBy:  string | null
  createdAt:   Date
}

type Fund   = { id: string; name: string; isActive: boolean }
type Member = { id: string; name: string }

const CAT_BADGE: Record<string, string> = {
  MINISTRY:    'bg-blue-100 text-blue-700',
  UTILITIES:   'bg-amber-100 text-amber-700',
  MAINTENANCE: 'bg-orange-100 text-orange-700',
  SALARIES:    'bg-purple-100 text-purple-700',
  OTHER:       'bg-gray-100 text-gray-600',
}

function formatKES(n: string | number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(Number(n))
}

function formatDate(d: string | Date) {
  return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export function ExpensesPage({ expenses, funds, members, userId }: {
  expenses: Expense[]
  funds:    Fund[]
  members:  Member[]
  userId:   string
}) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm,  setShowForm]     = useState(false)
  const [error,     setError]        = useState('')

  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    fundId: '', title: '', category: 'OTHER', amount: '',
    date: today, description: '', approvedBy: '',
  })

  const activeFunds = funds.filter(f => f.isActive)
  const total       = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createExpense({
        ...form,
        description: form.description || undefined,
        approvedBy:  form.approvedBy  || undefined,
      })
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setForm({ fundId: '', title: '', category: 'OTHER', amount: '', date: today, description: '', approvedBy: '' })
      router.refresh()
    })
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete expense "${title}"?`)) return
    startTransition(async () => {
      await deleteExpense(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Expenses</h2>
          <p className="text-sm text-muted mt-0.5">
            {expenses.length} records · {formatKES(total)} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer self-start"
        >
          <Plus size={16} /> Log Expense
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">Log Expense</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Title</label>
                <input type="text" required value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Electricity bill"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
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
                <input type="number" required min={1} value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="3500"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Date</label>
                <input title="Date" type="date" required value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Category</label>
                <select title="Category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  {['MINISTRY','UTILITIES','MAINTENANCE','SALARIES','OTHER'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Approved By <span className="text-muted font-normal">(optional)</span></label>
                <select title="Approved By" value={form.approvedBy} onChange={e => setForm(p => ({ ...p, approvedBy: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">— None —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
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
                {isPending ? 'Saving...' : 'Log Expense'}
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
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Fund</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted text-sm">No expenses logged yet</td></tr>
              ) : expenses.map((e, i) => (
                <tr key={e.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#111827]">{e.title}</p>
                    {e.description && <p className="text-xs text-muted">{e.description}</p>}
                  </td>
                  <td className="px-5 py-3 text-muted">{e.fundName}</td>
                  <td className="px-5 py-3 font-semibold text-danger">{formatKES(e.amount)}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${CAT_BADGE[e.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted text-xs hidden md:table-cell">{formatDate(e.date)}</td>
                  <td className="px-5 py-3">
                    <button title="Delete Expense" onClick={() => handleDelete(e.id, e.title)} disabled={isPending}
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