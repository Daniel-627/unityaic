'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { Plus, Trash2 }            from 'lucide-react'
import { createEvent, deleteEvent } from '@/lib/actions/events'

type Event = {
  id:             string
  title:          string
  type:           string
  startDate:      string
  endDate:        string | null
  location:       string | null
  capacity:       number | null
  isPublished:    boolean
  departmentName: string | null
}

const TYPE_BADGE: Record<string, string> = {
  GENERAL:    'bg-gray-100 text-gray-600',
  RALLY:      'bg-blue-100 text-blue-700',
  AGM:        'bg-purple-100 text-purple-700',
  CONFERENCE: 'bg-indigo-100 text-indigo-700',
  SPECIAL:    'bg-amber-100 text-amber-700',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function EventsList({ events, userId }: { events: Event[]; userId: string }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm,  setShowForm]     = useState(false)
  const [error,     setError]        = useState('')

  const [form, setForm] = useState({
    title: '', type: 'GENERAL', description: '',
    startDate: '', endDate: '', location: '',
    capacity: '', isPublished: false,
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await createEvent({
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        endDate:  form.endDate  || undefined,
      }, userId)
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setShowForm(false)
      setForm({ title: '', type: 'GENERAL', description: '', startDate: '', endDate: '', location: '', capacity: '', isPublished: false })
      router.refresh()
    })
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    startTransition(async () => {
      await deleteEvent(id)
      router.refresh()
    })
  }

  const upcoming = events.filter(e => new Date(e.startDate) >= new Date())
  const past     = events.filter(e => new Date(e.startDate) <  new Date())

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Events</h2>
          <p className="text-sm text-muted mt-0.5">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-display text-base font-semibold text-primary mb-4">New Event</h3>
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
                  placeholder="Annual General Meeting"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Type</label>
                <select
                  title="Event Type"
                  value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="GENERAL">General</option>
                  <option value="RALLY">Rally</option>
                  <option value="AGM">AGM</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="SPECIAL">Special</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Start Date</label>
                <input
                    title="Start Date"
                  type="date" required value={form.startDate}
                  onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">End Date <span className="text-muted font-normal">(optional)</span></label>
                <input
                  title="End Date"
                  type="date" value={form.endDate}
                  onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Location <span className="text-muted font-normal">(optional)</span></label>
                <input
                  type="text" value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Main Hall"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Capacity <span className="text-muted font-normal">(optional)</span></label>
                <input
                  type="number" value={form.capacity} min={1}
                  onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                  placeholder="200"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[13px] font-medium text-primary">Description <span className="text-muted font-normal">(optional)</span></label>
                <textarea
                  title='Desc'
                  value={form.description} rows={2}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  title="Toggle Publish"
                  type="button"
                  onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.isPublished ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm font-medium text-[#111827]">
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="flex gap-3 pt-1 border-t border-border">
              <button
                title="Create Event"
                type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Creating...' : 'Create Event'}
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

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-sunken">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Upcoming</p>
          </div>
          <EventTable events={upcoming} isPending={isPending} onDelete={handleDelete} />
        </div>
      )}

      {/* Past */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-sunken">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            {upcoming.length > 0 ? 'Past Events' : 'All Events'}
          </p>
        </div>
        <EventTable events={past.length > 0 ? past : events} isPending={isPending} onDelete={handleDelete} />
      </div>
    </div>
  )
}

function EventTable({
  events, isPending, onDelete,
}: {
  events: Event[]
  isPending: boolean
  onDelete: (id: string, title: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-white">
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Event</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Type</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Date</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Location</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-muted text-sm">No events yet</td>
            </tr>
          ) : (
            events.map((event, i) => (
              <tr
                key={event.id}
                className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}
              >
                <td className="px-5 py-3">
                  <p className="font-medium text-[#111827]">{event.title}</p>
                  {event.departmentName && (
                    <p className="text-xs text-muted">{event.departmentName}</p>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BADGE[event.type] ?? 'bg-gray-100 text-gray-600'}`}>
                    {event.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted text-xs hidden sm:table-cell">
                  {formatDate(event.startDate)}
                  {event.endDate && ` → ${formatDate(event.endDate)}`}
                </td>
                <td className="px-5 py-3 text-muted hidden md:table-cell">
                  {event.location ?? '—'}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    event.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {event.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-xs font-medium text-primary hover:text-primary-light transition-colors no-underline"
                    >
                      Manage
                    </Link>
                    <button
                        title='Delete'
                      onClick={() => onDelete(event.id, event.title)}
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
  )
}