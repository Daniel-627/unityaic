'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react'
import {
  updateDepartment,
  addMemberToDepartment,
  removeMemberFromDepartment,
} from '@/lib/actions/ministry'

type RosterMember = {
  membershipId: string
  memberId:     string
  memberName:   string
  memberEmail:  string
  memberRole:   string
  joinedAt:     Date
  isActive:     boolean
}

type AllMember = {
  id:   string
  name: string
  role: string
}

type Department = {
  id:          string
  name:        string
  type:        string
  description: string | null
  isActive:    boolean
  headId:      string | null
  headName:    string | null
  roster:      RosterMember[]
  allMembers:  AllMember[]
}

const ROLE_BADGE: Record<string, string> = {
  ADMIN:           'bg-blue-100 text-blue-700',
  FINANCE_OFFICER: 'bg-purple-100 text-purple-700',
  DEPT_HEAD:       'bg-amber-100 text-amber-700',
  MEMBER:          'bg-gray-100 text-gray-600',
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function DepartmentDetail({ department }: { department: Department }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name:        department.name,
    description: department.description ?? '',
    headId:      department.headId ?? '',
  })
  const [selectedMember, setSelectedMember] = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const activeRoster = department.roster.filter(r => r.isActive)

  // members not already in dept
  const available = department.allMembers.filter(
    m => !activeRoster.find(r => r.memberId === m.id)
  )

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    startTransition(async () => {
      const res = await updateDepartment({
        id:          department.id,
        name:        form.name,
        description: form.description,
        headId:      form.headId || null,
      })

      if (!res.success) { setError(res.error ?? 'Failed to update.'); return }
      setSuccess('Department updated.')
      router.refresh()
    })
  }

  function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMember) return
    setError('')

    startTransition(async () => {
      const res = await addMemberToDepartment({
        departmentId: department.id,
        memberId:     selectedMember,
      })

      if (!res.success) { setError(res.error ?? 'Failed to add member.'); return }
      setSelectedMember('')
      router.refresh()
    })
  }

  function handleRemove(membershipId: string, name: string) {
    if (!confirm(`Remove ${name} from this department?`)) return
    startTransition(async () => {
      await removeMemberFromDepartment(membershipId)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/ministry"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:bg-sunken transition-colors no-underline"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">{department.name}</h2>
          <p className="text-sm text-muted mt-0.5">{activeRoster.length} active members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — settings */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-display text-base font-semibold text-primary mb-4">Department Settings</h3>
            <form onSubmit={handleSave} className="flex flex-col gap-3">

              {error && (
                <div className="px-3 py-2.5 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-xs">
                  {error}
                </div>
              )}
              {success && (
                <div className="px-3 py-2.5 rounded-lg bg-green-50 border-l-4 border-green-500 text-green-700 text-xs">
                  {success}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Name</label>
                <input
                    title='Name'
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Description</label>
                <textarea
                  title='Desc'
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Department Head</label>
                <select
                  title='Dept Head'
                  value={form.headId}
                  onChange={e => setForm(p => ({ ...p, headId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">— No head assigned —</option>
                  {department.allMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer mt-1"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Add member */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-display text-base font-semibold text-primary mb-4 flex items-center gap-2">
              <UserPlus size={16} /> Add Member
            </h3>
            <form onSubmit={handleAddMember} className="flex flex-col gap-3">
              <select
                title="Select a member to add"
                value={selectedMember}
                onChange={e => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option value="">— Select member —</option>
                {available.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isPending || !selectedMember}
                className="w-full py-2.5 rounded-lg bg-accent text-primary-dark text-sm font-semibold hover:bg-accent-light transition-colors disabled:opacity-60 cursor-pointer"
              >
                Add to Department
              </button>
            </form>
          </div>
        </div>

        {/* Right — roster */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold text-primary">
              Roster — {activeRoster.length} members
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {activeRoster.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted text-sm">
                      No members in this department yet
                    </td>
                  </tr>
                ) : (
                  activeRoster.map((r, i) => (
                    <tr
                      key={r.membershipId}
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
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_BADGE[r.memberRole] ?? 'bg-gray-100 text-gray-600'}`}>
                          {r.memberRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted text-xs hidden md:table-cell">
                        {formatDate(r.joinedAt)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleRemove(r.membershipId, r.memberName)}
                          disabled={isPending}
                          className="flex items-center gap-1 text-xs font-medium text-danger hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                        >
                          <UserMinus size={13} /> Remove
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