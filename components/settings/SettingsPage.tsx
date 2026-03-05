'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { updateProfile, changePassword } from '@/lib/actions/settings'

type Member = {
  id:    string
  name:  string
  email: string
  phone: string | null
  role:  string
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN:           'Administrator',
  FINANCE_OFFICER: 'Finance Officer',
  DEPT_HEAD:       'Department Head',
  MEMBER:          'Member',
}

export function SettingsPage({ member }: { member: Member }) {
  const router                       = useRouter()
  const [isPending, startTransition] = useTransition()

  // profile form
  const [profile, setProfile] = useState({
    name:  member.name,
    email: member.email,
    phone: member.phone ?? '',
  })
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // password form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)
    startTransition(async () => {
      const res = await updateProfile(member.id, {
        name:  profile.name,
        email: profile.email,
        phone: profile.phone || undefined,
      })
      if (!res.success) {
        setProfileMsg({ type: 'error', text: res.error ?? 'Failed to update profile.' })
        return
      }
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
      router.refresh()
    })
  }

  function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)
    startTransition(async () => {
      const res = await changePassword(member.id, passwords)
      if (!res.success) {
        setPasswordMsg({ type: 'error', text: res.error ?? 'Failed to change password.' })
        return
      }
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    })
  }

  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">

      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Settings</h2>
        <p className="text-sm text-muted mt-0.5">Manage your account</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-white ring-4 ring-accent/30 shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-display text-lg font-bold text-primary">{member.name}</p>
            <p className="text-sm text-muted">{member.email}</p>
            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
              {ROLE_LABEL[member.role] ?? member.role}
            </span>
          </div>
        </div>

        <h3 className="font-display text-base font-semibold text-primary mb-4">Profile Information</h3>
        <form onSubmit={handleProfile} className="flex flex-col gap-4">
          {profileMsg && (
            <div className={`px-4 py-3 rounded-lg border-l-4 text-sm ${
              profileMsg.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-red-50 border-danger text-danger'
            }`}>
              {profileMsg.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Full Name</label>
              <input
                title="Enter your full name"
                type="text" required value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Email Address</label>
              <input
                title="Enter your email address"
                type="email" required value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[13px] font-medium text-primary">
                Phone <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                title="Enter your phone number (optional)"
                type="tel" value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <button
                title="Save changes to your profile information"
              type="submit" disabled={isPending}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Password card */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-display text-base font-semibold text-primary mb-4">Change Password</h3>
        <form onSubmit={handlePassword} className="flex flex-col gap-4">
          {passwordMsg && (
            <div className={`px-4 py-3 rounded-lg border-l-4 text-sm ${
              passwordMsg.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-red-50 border-danger text-danger'
            }`}>
              {passwordMsg.text}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Current Password</label>
              <input
                title="Enter your current password"
                type="password" required value={passwords.currentPassword}
                onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">New Password</label>
              <input
                title="Enter your new password"
                type="password" required value={passwords.newPassword}
                onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                placeholder="Min. 6 characters"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-primary">Confirm New Password</label>
              <input
                title="Re-enter the new password for confirmation"
                type="password" required value={passwords.confirmPassword}
                onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-[#111827] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <button
              title="Change your password"
              type="submit" disabled={isPending}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isPending ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Read-only info */}
      <div className="bg-sunken rounded-xl border border-border p-5">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Account Info</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Role</span>
            <span className="font-medium text-primary">{ROLE_LABEL[member.role] ?? member.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Role changes</span>
            <span className="font-medium text-primary">Contact your Administrator</span>
          </div>
        </div>
      </div>
    </div>
  )
}