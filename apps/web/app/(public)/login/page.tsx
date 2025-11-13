'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import FancyButton from '@/components/ui/FancyButton'
import { setAuthCookies } from '@/lib/cookies'

const DEMO_EMAIL = 'admin@test.com'
const DEMO_PASSWORD = '123456'

export default function LoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const isDemo = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
    if (isDemo) {
      setAuthCookies(email.trim())
      const next = search.get('next')
      router.push(next && next.startsWith('/') ? next : '/dashboard')
      setLoading(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    setError('Incorrect email or password. Try the demo account below.')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="glass-card w-full max-w-5xl p-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 text-left">
          <p className="chip">Talk Learning</p>
          <h1 className="hero-title text-left">log in</h1>
          <p className="hero-subtitle text-left">Reconnect with your Mandarin tutor and keep your streak alive.</p>
          <div className="grid gap-4">
            <div className="glass-outline p-4 rounded-2xl">
              <p className="text-sm font-semibold text-slate-700">Keep your streak</p>
              <p className="text-sm text-slate-500 mt-1">Dashboard cards update as soon as you complete a lesson.</p>
            </div>
            <div className="glass-outline p-4 rounded-2xl">
              <p className="text-sm font-semibold text-slate-700">Sync everywhere</p>
              <p className="text-sm text-slate-500 mt-1">History, flashcards, and retry points follow you across devices.</p>
            </div>
          </div>
        </section>

        <section>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-sm font-medium text-slate-600">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_EMAIL}
                className="input-field mt-2"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-medium text-slate-600">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={DEMO_PASSWORD}
                className="input-field mt-2"
                required
              />
            </div>
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            <FancyButton type="submit" variant="solid" className="w-full justify-center">
              {loading ? 'logging in…' : 'log in'}
            </FancyButton>
          </form>

          <div className="mt-6 glass-outline rounded-2xl px-4 py-3 text-sm">
            <p className="text-xs uppercase text-slate-500 mb-1">Demo account</p>
            <div className="flex items-center justify-between">
              <span>{DEMO_EMAIL}</span>
              <span className="px-2 py-1 rounded-lg bg-white/70 font-mono text-xs">{DEMO_PASSWORD}</span>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an account?
            <Link href="/register" className="brand-link ml-2 font-semibold">sign up</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
