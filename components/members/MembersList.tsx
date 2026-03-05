'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { UserPlus, Search }        from 'lucide-react'
import { deactivateMember }        from '@/lib/actions/members'

type Member = {
  id:        string
  name:      string
  email:     string
  phone:     string | null
  role:      string
  isActive:  boolean
  createdAt: Date
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

export function MembersList({
  members,
  search,
}: {
  members: Member[]
  search:  string
}) {
  const router               = useRouter()
  const [query, setQuery]    = useState(search)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      router.push(query ? `/members?search=${encodeURIComponent(query)}` : '/members')
    })
  }

  async function handleDeactivate(id: string, name: string) {
    if (!confirm(`Deactivate ${name}? They will lose access.`)) return
    await deactivateMember(id)
    router.refresh()
  }

  const active   = members.filter(m => m.isActive)
  const inactive = members.filter(m => !m.isActive)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Members</h2>
          <p className="text-sm text-muted mt-0.5">
            {active.length} active · {inactive.length} inactive
          </p>
        </div>
        <Link
          href="/members/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors no-underline self-start sm:self-auto"
        >
          <UserPlus size={16} />
          Add Member
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-60"
        >
          {isPending ? '...' : 'Search'}
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setQuery(''); router.push('/members') }}
            className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted hover:bg-sunken transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted text-sm">
                    {search ? `No members found for "${search}"` : 'No members yet'}
                  </td>
                </tr>
              ) : (
                members.map((member, i) => (
                  <tr
                    key={member.id}
                    className={`border-b border-border hover:bg-sunken transition-colors ${i % 2 === 1 ? 'bg-[#F9FAFC]' : ''}`}
                  >
                    {/* Name + email */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#111827] truncate">{member.name}</p>
                          <p className="text-xs text-muted truncate">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3 text-muted hidden sm:table-cell">
                      {member.phone ?? '—'}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_BADGE[member.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3 text-muted text-xs hidden md:table-cell">
                      {formatDate(member.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        member.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/members/${member.id}`}
                          className="text-xs font-medium text-primary hover:text-primary-light transition-colors no-underline"
                        >
                          Edit
                        </Link>
                        {member.isActive && (
                          <button
                            onClick={() => handleDeactivate(member.id, member.name)}
                            className="text-xs font-medium text-danger hover:opacity-70 transition-opacity cursor-pointer"
                          >
                            Deactivate
                          </button>
                        )}
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