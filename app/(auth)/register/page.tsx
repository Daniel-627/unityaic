'use client'

import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import Link          from 'next/link'
import Image         from 'next/image'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    phone:    '',
    password: '',
    confirm:  '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Registration failed. Please try again.')
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-primary p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center ring-2 ring-accent/50">
            <Image src="/aiclogo.png" alt="AIC Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-tight">Unity AIC</p>
            <p className="text-[10px] text-accent font-medium tracking-widest uppercase">Church Platform</p>
          </div>
        </div>

        <div>
          <div className="w-12 h-0.5 bg-accent mb-6" />
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Join the Unity AIC<br />community.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Register to access your giving history, ministry department activities, and church events.
          </p>
        </div>

        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Unity AIC Church. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center ring-2 ring-primary/20">
              <Image src="/aiclogo.png" alt="AIC Logo" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-primary leading-tight">Unity AIC</p>
              <p className="text-[10px] text-muted font-medium tracking-widest uppercase">Church Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-primary mb-1">Create account</h2>
            <p className="text-sm text-muted">You'll be registered as a Member by default</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">
                {error}
              </div>
            )}

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[13px] font-medium text-primary tracking-wide">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Jane Wanjiku"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-primary tracking-wide">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[13px] font-medium text-primary tracking-wide">
                Phone <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-primary tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="text-[13px] font-medium text-primary tracking-wide">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={e => update('confirm', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">Already have an account?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center w-full py-2.5 rounded-lg border border-border text-sm font-medium text-primary hover:bg-sunken transition-colors"
          >
            Sign in instead
          </Link>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-xs text-muted/60">
              Africa Inland Church Kenya · Local Church Council
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}