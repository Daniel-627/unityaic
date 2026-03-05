'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { Plus }                    from 'lucide-react'
import { createRemittanceRate, createRemittancePayment } from '@/lib/actions/finance'

type Rate = {
  id:            string
  council:       string
  ratePercent:   string
  effectiveFrom: string
  isActive:      boolean
}

type Payment = {
  id:          string
  council:     string
  period:      string
  amountDue:   string
  amountPaid:  string
  referenceNo: string | null
  paidAt:      Date | null
}

const COUNCILS = ['DCC', 'RCC', 'ACC', 'CCC']

const COUNCIL_LABEL: Record<string, string> = {
  DCC: 'District Church Council',
  RCC: 'Regional Church Council',
  ACC: 'Area Church Council',
  CCC: 'Congregational Church Council',
}

function formatKES(n: string | number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(Number(n))
}

export function RemittancesPage({ rates, payments, userId }: {
  rates:    Rate[]
  payments: Payment[]
  userId:   string
}) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tab,       setTab]          = useState<'payments' | 'rates'>('payments')
  const [showForm,  setShowForm]     = useState(false)
  const [error,     setError]        = useState('')

  const currentMonth = new Date().toISOString().slice(0, 7)

  const [payForm, setPayForm] = useState({
    council: 'DCC', period: currentMonth, amountDue: '',
    amountPaid: '', referenceNo: '', paidAt: '',
  })

  const [rateForm, setRateForm] = useState({
    council: 'DCC', ratePercent: '', effectiveFrom: new Date().toISOString().split('T')[0],
  })

  function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createRemittancePayment({
        ...payForm,
        referenceNo: payForm.referenceNo || undefined,
        paidAt:      payForm.paidAt      || undefined,
      }, userId)
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setPayForm({ council: 'DCC', period: currentMonth, amountDue: '', amountPaid: '', referenceNo: '', paidAt: '' })
      router.refresh()
    })
  }

  function handleRate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createRemittanceRate(rateForm, userId)
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setRateForm({ council: 'DCC', ratePercent: '', effectiveFrom: new Date().toISOString().split('T')[0] })
      router.refresh()
    })
  }

  const pending = payments.filter(p => Number(p.amountPaid) < Number(p.amountDue))
  const paid    = payments.filter(p => Number(p.amountPaid) >= Number(p.amountDue))

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Remittances</h2>
          <p className="text-sm text-muted mt-0.5">
            AIC Kenya council remittances · {pending.length} pending
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer self-start"
        >
          <Plus size={16} /> {tab === 'payments' ? 'Record Payment' : 'Set Rate'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sunken p-1 rounded-lg w-fit">
        {(['payments', 'rates'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setShowForm(false) }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer capitalize ${
              tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Forms */}
      {showForm && tab === 'payments' && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">Record Remittance Payment</h3>
          <form onSubmit={handlePayment} className="flex flex-col gap-4">
            {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Council</label>
                <select title="Council" value={payForm.council} onChange={e => setPayForm(p => ({ ...p, council: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  {COUNCILS.map(c => <option key={c} value={c}>{c} — {COUNCIL_LABEL[c]}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Period (YYYY-MM)</label>
                <input title="Period" type="month" required value={payForm.period}
                  onChange={e => setPayForm(p => ({ ...p, period: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Amount Due (KES)</label>
                <input title="Amount Due" type="number" required min={0} value={payForm.amountDue}
                  onChange={e => setPayForm(p => ({ ...p, amountDue: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Amount Paid (KES)</label>
                <input title="Amount Paid" type="number" required min={0} value={payForm.amountPaid}
                  onChange={e => setPayForm(p => ({ ...p, amountPaid: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Reference No <span className="text-muted font-normal">(optional)</span></label>
                <input title="Reference No" type="text" value={payForm.referenceNo}
                  onChange={e => setPayForm(p => ({ ...p, referenceNo: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Paid At <span className="text-muted font-normal">(optional)</span></label>
                <input title="Paid At" type="date" value={payForm.paidAt}
                  onChange={e => setPayForm(p => ({ ...p, paidAt: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1 border-t border-border">
              <button  type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Saving...' : 'Save Payment'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted hover:bg-sunken transition-colors cursor-pointer"
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showForm && tab === 'rates' && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">Set Remittance Rate</h3>
          <form onSubmit={handleRate} className="flex flex-col gap-4">
            {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Council</label>
                <select title="Council" value={rateForm.council} onChange={e => setRateForm(p => ({ ...p, council: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  {COUNCILS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Rate (%)</label>
                <input title="Rate (%)" type="number" required min={0.1} max={100} step={0.1} value={rateForm.ratePercent}
                  onChange={e => setRateForm(p => ({ ...p, ratePercent: e.target.value }))}
                  placeholder="10"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Effective From</label>
                <input title="Effective From" type="date" required value={rateForm.effectiveFrom}
                  onChange={e => setRateForm(p => ({ ...p, effectiveFrom: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1 border-t border-border">
              <button type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Saving...' : 'Set Rate'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted hover:bg-sunken transition-colors cursor-pointer"
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Payments tab */}
      {tab === 'payments' && (
        <div className="flex flex-col gap-4">
          {pending.length > 0 && (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-red-50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-danger" />
                <p className="text-xs font-semibold text-danger uppercase tracking-wider">Pending — {pending.length}</p>
              </div>
              <RemittanceTable rows={pending} />
            </div>
          )}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-sunken">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                {pending.length > 0 ? 'Paid' : 'All Payments'}
              </p>
            </div>
            <RemittanceTable rows={paid.length > 0 ? paid : (pending.length === 0 ? payments : [])} />
          </div>
        </div>
      )}

      {/* Rates tab */}
      {tab === 'rates' && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Council</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Rate</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Effective From</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {rates.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-muted text-sm">No rates set yet</td></tr>
                ) : rates.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-primary">{r.council}</p>
                      <p className="text-xs text-muted">{COUNCIL_LABEL[r.council]}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-primary font-display text-lg">{r.ratePercent}%</td>
                    <td className="px-5 py-3 text-muted text-xs">
                      {new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(r.effectiveFrom))}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function RemittanceTable({ rows }: { rows: Payment[] }) {
  function formatKES(n: string | number) {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(Number(n))
  }

  const COUNCIL_LABEL: Record<string, string> = {
    DCC: 'District', RCC: 'Regional', ACC: 'Area', CCC: 'Congregational',
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-white">
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Council</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Period</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Due</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Paid</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Balance</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="px-5 py-12 text-center text-muted text-sm">No payments recorded</td></tr>
          ) : rows.map((p, i) => {
            const balance = Number(p.amountDue) - Number(p.amountPaid)
            const isPaid  = balance <= 0
            return (
              <tr key={p.id} className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}>
                <td className="px-5 py-3">
                  <p className="font-semibold text-primary">{p.council}</p>
                  <p className="text-xs text-muted">{COUNCIL_LABEL[p.council]}</p>
                </td>
                <td className="px-5 py-3 font-medium text-[#111827]">{p.period}</td>
                <td className="px-5 py-3 text-muted">{formatKES(p.amountDue)}</td>
                <td className="px-5 py-3 font-semibold text-green-700">{formatKES(p.amountPaid)}</td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <span className={`font-semibold ${isPaid ? 'text-green-700' : 'text-danger'}`}>
                    {isPaid ? '—' : formatKES(balance)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-danger'
                  }`}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}