'use client'

import { useState } from 'react'
import Link         from 'next/link'
import Image        from 'next/image'

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email }),
    })
    setLoading(false)
    setSubmitted(true)
  }

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

        {submitted ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <h2 className="font-display text-xl font-bold text-primary mb-2">Check your email</h2>
            <p className="text-sm text-muted mb-6">
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-primary mb-1">Forgot password?</h2>
              <p className="text-sm text-muted">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-primary">Email address</label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-muted hover:text-primary transition-colors">
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}