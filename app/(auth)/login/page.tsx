'use client'

import { useState } from 'react'
import { signIn }   from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link          from 'next/link'
import Image         from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
      return
    }

    router.push('/dashboard')
    router.refresh()
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
            Serving the church,<br />one record at a time.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Manage members, ministry departments, contributions, and AIC Kenya council remittances — all in one place.
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
            <h2 className="font-display text-2xl font-bold text-primary mb-1">Welcome back</h2>
            <p className="text-sm text-muted">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border-l-4 border-danger text-danger text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-primary tracking-wide">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@unityaic.org"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-medium text-primary tracking-wide">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-accent hover:text-accent-dark transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-[#111827] placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">New to Unity AIC?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link
            href="/register"
            className="flex items-center justify-center w-full py-2.5 rounded-lg border border-border text-sm font-medium text-primary hover:bg-sunken transition-colors"
          >
            Create an account
          </Link>

          {/* Gold rule */}
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