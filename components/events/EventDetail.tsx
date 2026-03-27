'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react'
import {
  updateEvent,
  registerForEvent,
  toggleAttended,
  removeRegistration,
} from '@/lib/actions/events'
import { EventMedia } from '@/components/events/EventMedia'

import { useSearchParams } from 'next/navigation'

import { sendEventReminders } from '@/lib/actions/email'




type Registration = {
  id:           string
  memberId:     string
  memberName:   string
  memberEmail:  string
  registeredAt: Date
  attended:     boolean
}

type Event = {
  id:             string
  title:          string
  type:           string
  description:    string | null
  startDate:      string
  endDate:        string | null
  location:       string | null
  capacity:       number | null
  isPublished:    boolean
  departmentId:   string | null
  departmentName: string | null
  registrations:  Registration[]
  allMembers:     { id: string; name: string }[]
  allDepartments: { id: string; name: string }[]
  media: {
    _id:     string
    banner:  any
    gallery: { _key: string; asset: any; caption?: string }[]
  } | null
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function EventDetail({ event }: { event: Event }) {
  const router                              = useRouter()
  const [isPending, startTransition]        = useTransition()
  const [selectedMember, setSelectedMember] = useState('')
  const [error,          setError]          = useState('')
  const [success,        setSuccess]        = useState('')

  const [reminderSent, setReminderSent] = useState(false)

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'details' | 'media'>(
    searchParams.get('tab') === 'media' ? 'media' : 'details'
  )

  const [form, setForm] = useState({
    title:        event.title,
    type:         event.type,
    description:  event.description  ?? '',
    startDate:    event.startDate,
    endDate:      event.endDate      ?? '',
    location:     event.location     ?? '',
    capacity:     event.capacity?.toString() ?? '',
    departmentId: event.departmentId ?? '',
    isPublished:  event.isPublished,
  })

  const registered    = event.registrations
  const attendedCount = registered.filter(r => r.attended).length
  const available     = event.allMembers.filter(m => !registered.find(r => r.memberId === m.id))

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    startTransition(async () => {
      const res = await updateEvent({
        id: event.id,
        ...form,
        capacity:     form.capacity     ? Number(form.capacity) : undefined,
        endDate:      form.endDate      || undefined,
        departmentId: form.departmentId || undefined,
      })
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setSuccess('Event updated.')
      router.refresh()
    })
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMember) return
    setError('')
    startTransition(async () => {
      const res = await registerForEvent(event.id, selectedMember)
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setSelectedMember('')
      router.refresh()
    })
  }

  function handleToggle(regId: string, current: boolean) {
    startTransition(async () => {
      await toggleAttended(regId, current)
      router.refresh()
    })
  }

  function handleRemove(regId: string, name: string) {
    if (!confirm(`Remove ${name} from this event?`)) return
    startTransition(async () => {
      await removeRegistration(regId)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-5xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin-events"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:bg-sunken transition-colors no-underline"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">{event.title}</h2>
          <p className="text-sm text-muted mt-0.5">
            {formatDate(event.startDate)}
            {event.endDate ? ` → ${formatDate(event.endDate)}` : ''}
            {event.location ? ` · ${event.location}` : ''}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E5E7EB' }}>
        {(['details', 'media'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', fontSize: '13px', fontWeight: '600',
              border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #1B3A6B' : '2px solid transparent',
              color: activeTab === tab ? '#1B3A6B' : '#6B7280',
              marginBottom: '-2px', textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — edit + register */}
          <div className="flex flex-col gap-4">

            {/* Edit form */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-display text-base font-semibold text-primary mb-4">Event Details</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                {error   && <div className="px-3 py-2 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-xs">{error}</div>}
                {success && <div className="px-3 py-2 rounded-lg bg-green-50 border-l-4 border-green-500 text-green-700 text-xs">{success}</div>}

                {[
                  { label: 'Title',      field: 'title',     type: 'text',   required: true  },
                  { label: 'Start Date', field: 'startDate', type: 'date',   required: true  },
                  { label: 'End Date',   field: 'endDate',   type: 'date',   required: false },
                  { label: 'Location',   field: 'location',  type: 'text',   required: false },
                  { label: 'Capacity',   field: 'capacity',  type: 'number', required: false },
                ].map(({ label, field, type, required }) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-primary">{label}</label>
                    <input
                      title={label}
                      type={type}
                      required={required}
                      value={(form as any)[field]}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-primary">Type</label>
                  <select
                    title="Event Type"
                    value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  >
                    {['GENERAL','RALLY','AGM','CONFERENCE','SPECIAL'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-primary">Department</label>
                  <select
                    title="Department"
                    value={form.departmentId} onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  >
                    <option value="">— None —</option>
                    {event.allDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
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

                <button
                  type="submit" disabled={isPending}
                  className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer mt-1"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Register member */}
<div className="bg-white rounded-xl border border-border p-5">
  <h3 className="font-display text-base font-semibold text-primary mb-4 flex items-center gap-2">
    <UserPlus size={16} /> Register Member
  </h3>
  <form onSubmit={handleRegister} className="flex flex-col gap-3">
    <select
      title="Select Member"
      value={selectedMember} onChange={e => setSelectedMember(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
    >
      <option value="">— Select member —</option>
      {available.map(m => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
    <div className="flex gap-2">
      <button
        type="submit" disabled={isPending || !selectedMember}
        className="flex-1 py-2.5 rounded-lg bg-accent text-primary-dark text-sm font-semibold hover:bg-accent-light transition-colors disabled:opacity-60 cursor-pointer"
      >
        Register
      </button>
      <button
        type="button"
        disabled={isPending || available.length === 0}
        onClick={() => {
          if (!confirm(`Register all ${available.length} remaining members?`)) return
          startTransition(async () => {
            await Promise.all(available.map(m => registerForEvent(event.id, m.id)))
            router.refresh()
          })
        }}
        className="px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
        title="Register all members"
      >
        All
      </button>
    </div>
    {available.length > 0 && (
      <p className="text-xs text-muted">{available.length} member{available.length !== 1 ? 's' : ''} not yet registered</p>
    )}
  </form>
</div>

            
<div className="bg-white rounded-xl border border-border p-5">
  <h3 className="font-display text-base font-semibold text-primary mb-2">Send Reminders</h3>
  <p className="text-xs text-muted mb-4">
    Send an email reminder to all {registered.length} registered members.
  </p>
  {reminderSent && (
    <div className="px-3 py-2 rounded-lg bg-green-50 border-l-4 border-green-500 text-green-700 text-xs mb-3">
      Reminders sent successfully.
    </div>
  )}
  <button
    onClick={() => {
      startTransition(async () => {
        const res = await sendEventReminders(event.id)
        if (res.success) setReminderSent(true)
      })
    }}
    disabled={isPending || registered.length === 0}
    className="w-full py-2.5 rounded-lg bg-accent text-primary-dark text-sm font-semibold disabled:opacity-60 cursor-pointer hover:bg-accent-light transition-colors"
  >
    {isPending ? 'Sending...' : `Send Reminder to ${registered.length} Members`}
  </button>
</div>

          </div>


          {/* Right — registrations */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-primary">
                Registrations — {registered.length}
              </h3>
              <span className="text-xs text-muted">
                {attendedCount} attended
                {event.capacity ? ` · ${event.capacity} capacity` : ''}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Registered</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Attended</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {registered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-muted text-sm">
                        No registrations yet
                      </td>
                    </tr>
                  ) : (
                    registered.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                              {r.memberName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[#111827] truncate">{r.memberName}</p>
                              <p className="text-xs text-muted truncate">{r.memberEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted text-xs hidden sm:table-cell">
                          {new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short' }).format(new Date(r.registeredAt))}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleToggle(r.id, r.attended)}
                            disabled={isPending}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                              r.attended
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {r.attended ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            title="Remove registration"
                            onClick={() => handleRemove(r.id, r.memberName)}
                            disabled={isPending}
                            className="text-danger hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Media tab */}
      {activeTab === 'media' && (
        <EventMedia
          eventId={event.id}
          eventTitle={event.title}
          initialMedia={event.media}
        />
      )}

    </div>
  )
}