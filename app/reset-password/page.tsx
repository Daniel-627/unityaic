'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link   from 'next/link'
import Image  from 'next/image'

function ResetForm() {
  const searchParams          = useSearchParams()
  const router                = useRouter()
  const token                 = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    const res  = await fetch('/api/auth/reset-password', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error ?? 'Reset failed.'); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  if (!token) return (
    <div className="text-center">
      <p className="text-danger text-sm mb-4">Invalid reset link.</p>
      <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Request a new one</Link>
    </div>
  )

  if (done) return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
      <h2 className="font-display text-xl font-bold text-primary mb-2">Password reset!</h2>
      <p className="text-sm text-muted">Redirecting you to sign in...</p>
    </div>
  )

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-primary mb-1">Set new password</h2>
        <p className="text-sm text-muted">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">{error}</div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-primary">New Password</label>
          <input
            type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-primary">Confirm Password</label>
          <input
            type="password" required value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center ring-2 ring-primary/20">
            <Image src="/aiclogo.png" alt="AIC Logo" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-primary leading-tight">Unity AIC</p>
            <p className="text-[10px] text-muted font-medium tracking-widest uppercase">Church Platform</p>
          </div>
        </div>
        <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}