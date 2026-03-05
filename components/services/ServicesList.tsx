'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { Plus, Trash2 }            from 'lucide-react'
import { createService, deleteService } from '@/lib/actions/services'

type Service = {
  id:            string
  title:         string
  type:          string
  date:          string
  time:          string | null
  officiantName: string | null
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

export function ServicesList({ services }: { services: Service[] }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm,  setShowForm]     = useState(false)
  const [error,     setError]        = useState('')

  const [form, setForm] = useState({
    title: '', type: 'SUNDAY_SERVICE', date: '', time: '', description: '', notes: '',
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createService(form)
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setForm({ title: '', type: 'SUNDAY_SERVICE', date: '', time: '', description: '', notes: '' })
      router.refresh()
    })
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This will remove all attendance records.`)) return
    startTransition(async () => {
      await deleteService(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Services</h2>
          <p className="text-sm text-muted mt-0.5">{services.length} service{services.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">New Service</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Title</label>
                <input
                  type="text" required value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Sunday Morning Service"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Type</label>
                <select
                  title="Type"
                  value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="SUNDAY_SERVICE">Sunday Service</option>
                  <option value="MIDWEEK">Midweek</option>
                  <option value="PRAYER">Prayer</option>
                  <option value="SPECIAL">Special</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Date</label>
                <input
                    title="Date"
                  type="date" required value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Time <span className="text-muted font-normal">(optional)</span></label>
                <input
                  title="Time"
                  type="time" value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[13px] font-medium text-primary">Notes <span className="text-muted font-normal">(optional)</span></label>
                <textarea
                  title="Notes"
                  value={form.notes} rows={2}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1 border-t border-border">
              <button
                type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Creating...' : 'Create Service'}
              </button>
              <button
                type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted hover:bg-sunken transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Officiant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted text-sm">
                    No services recorded yet — create your first service above
                  </td>
                </tr>
              ) : (
                services.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}
                  >
                    <td className="px-5 py-3 font-medium text-[#111827]">{s.title}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[s.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABEL[s.type] ?? s.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted text-xs hidden sm:table-cell">{formatDate(s.date)}</td>
                    <td className="px-5 py-3 text-muted hidden md:table-cell">{s.officiantName ?? '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/services/${s.id}`}
                          className="text-xs font-medium text-primary hover:text-primary-light transition-colors no-underline"
                        >
                          Attendance
                        </Link>
                        <button
                          title="Delete Service"
                          onClick={() => handleDelete(s.id, s.title)}
                          disabled={isPending}
                          className="text-danger hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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