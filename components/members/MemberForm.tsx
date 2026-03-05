'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import Link                        from 'next/link'
import { ArrowLeft }               from 'lucide-react'
import { createMember, updateMember } from '@/lib/actions/members'

type Member = {
  id:       string
  name:     string
  email:    string
  phone:    string | null
  role:     string
  isActive: boolean
}

const ROLES = [
  { value: 'MEMBER',           label: 'Member'           },
  { value: 'DEPT_HEAD',        label: 'Department Head'  },
  { value: 'FINANCE_OFFICER',  label: 'Finance Officer'  },
  { value: 'ADMIN',            label: 'Admin'            },
]

export function MemberForm({ member }: { member?: Member }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit                       = !!member

  const [form, setForm] = useState({
    name:     member?.name     ?? '',
    email:    member?.email    ?? '',
    phone:    member?.phone    ?? '',
    role:     member?.role     ?? 'MEMBER',
    isActive: member?.isActive ?? true,
    password: '',
  })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    startTransition(async () => {
      const payload = isEdit
        ? { id: member!.id, name: form.name, email: form.email, phone: form.phone, role: form.role, isActive: form.isActive }
        : { name: form.name, email: form.email, phone: form.phone, role: form.role, password: form.password }

      const res = isEdit
        ? await updateMember(payload)
        : await createMember(payload)

      if (!res.success) {
        setError(res.error ?? 'Something went wrong.')
        return
      }

      if (isEdit) {
        setSuccess('Member updated successfully.')
        router.refresh()
      } else {
        router.push('/members')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/members"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:bg-sunken transition-colors no-underline"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">
            {isEdit ? 'Edit Member' : 'Add Member'}
          </h2>
          <p className="text-sm text-muted mt-0.5">
            {isEdit ? `Editing ${member!.name}` : 'Create a new member account'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-border p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="px-4 py-3 rounded-lg bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Jane Wanjiku"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">
                Phone <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Role</label>
              <select
                title="Select Role"
                value={form.role}
                onChange={e => update('role', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Password — create only */}
            {!isEdit && (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[13px] font-medium text-primary">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            )}

            {/* Active toggle — edit only */}
            {isEdit && (
              <div className="flex items-center gap-3 sm:col-span-2 pt-1">
                <button
                  title="Toggle Active Status"
                  type="button"
                  onClick={() => update('isActive', !form.isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    form.isActive ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    form.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className="text-sm font-medium text-[#111827]">
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Member'}
            </button>
            <Link
              href="/members"
              className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted hover:bg-sunken transition-colors no-underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}