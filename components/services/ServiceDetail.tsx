'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { ArrowLeft, UserCheck, UserX } from 'lucide-react'
import { markAttendance, removeAttendance } from '@/lib/actions/services'
import { useSession } from 'next-auth/react'

type AttendanceRecord = {
  id:             string
  memberId:       string
  memberName:     string
  memberEmail:    string
  departmentId:   string | null
  departmentName: string | null
  createdAt:      Date
}

type Service = {
  id:            string
  title:         string
  type:          string
  date:          string
  time:          string | null
  description:   string | null
  notes:         string | null
  officiantName: string | null
  attendance:    AttendanceRecord[]
  allMembers:    { id: string; name: string }[]
  allDepartments: { id: string; name: string }[]
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date))
}

export function ServiceDetail({ service }: { service: Service }) {
  const router                       = useRouter()
  const { data: session }            = useSession()
  const [isPending, startTransition] = useTransition()
  const [selectedMember, setSelectedMember]   = useState('')
  const [selectedDept,   setSelectedDept]     = useState('')
  const [error, setError]                     = useState('')

  const present = service.attendance

  const available = service.allMembers.filter(
    m => !present.find(p => p.memberId === m.id)
  )

  function handleMark(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMember || !session?.user?.id) return
    setError('')

    startTransition(async () => {
      const res = await markAttendance(
        service.id,
        selectedMember,
        session.user.id,
        selectedDept || undefined,
      )
      if (!res.success) { setError(res.error ?? 'Failed.'); return }
      setSelectedMember('')
      setSelectedDept('')
      router.refresh()
    })
  }

  function handleRemove(id: string, name: string) {
    if (!confirm(`Remove ${name} from attendance?`)) return
    startTransition(async () => {
      await removeAttendance(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/services"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:bg-sunken transition-colors no-underline"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">{service.title}</h2>
          <p className="text-sm text-muted mt-0.5">
            {formatDate(service.date)}{service.time ? ` · ${service.time}` : ''}
            {service.officiantName ? ` · ${service.officiantName}` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Mark attendance */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-display text-base font-semibold text-primary mb-1 flex items-center gap-2">
              <UserCheck size={16} /> Mark Attendance
            </h3>
            <p className="text-xs text-muted mb-4">{present.length} present</p>

            <form onSubmit={handleMark} className="flex flex-col gap-3">
              {error && (
                <div className="px-3 py-2 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-xs">{error}</div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Member</label>
                <select
                  title="Member"
                  value={selectedMember}
                  onChange={e => setSelectedMember(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">— Select member —</option>
                  {available.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">
                  Department <span className="text-muted font-normal">(optional)</span>
                </label>
                <select
                  title="Department"
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">— No department —</option>
                  {service.allDepartments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isPending || !selectedMember}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Marking...' : 'Mark Present'}
              </button>
            </form>
          </div>

          {/* Service info */}
          {(service.notes || service.description) && (
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-display text-base font-semibold text-primary mb-3">Notes</h3>
              {service.description && <p className="text-sm text-[#111827] mb-2">{service.description}</p>}
              {service.notes && <p className="text-sm text-muted">{service.notes}</p>}
            </div>
          )}
        </div>

        {/* Attendance list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold text-primary">
              Present — {present.length} member{present.length !== 1 ? 's' : ''}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Department</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {present.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-muted text-sm">
                      No attendance marked yet
                    </td>
                  </tr>
                ) : (
                  present.map((r, i) => (
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
                      <td className="px-5 py-3 text-muted text-sm hidden sm:table-cell">
                        {r.departmentName ?? '—'}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleRemove(r.id, r.memberName)}
                          disabled={isPending}
                          className="flex items-center gap-1 text-xs font-medium text-danger hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                        >
                          <UserX size={13} /> Remove
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
    </div>
  )
}