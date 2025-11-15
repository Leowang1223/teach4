'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, AlertCircle, Loader2, Info, TrendingUp, RefreshCw } from 'lucide-react'
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
    <main className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="glass-card w-full max-w-5xl p-8 sm:p-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] shadow-2xl backdrop-blur-xl relative z-10 animate-fade-in">
        {/* 左侧：信息区 */}
        <section className="space-y-6 text-left">
          <div className="space-y-4">
            <p className="chip animate-slide-up">Talk Learning</p>
            <h1 className="hero-title text-left animate-slide-up" style={{ animationDelay: '0.1s' }}>
              log in
            </h1>
            <p className="hero-subtitle text-left text-base sm:text-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Reconnect with your Mandarin tutor and keep your streak alive.
            </p>
          </div>

          <div className="grid gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-outline p-5 rounded-2xl transform transition hover:scale-105 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Keep your streak</p>
                  <p className="text-sm text-slate-500 mt-1">Dashboard cards update as soon as you complete a lesson.</p>
                </div>
              </div>
            </div>
            <div className="glass-outline p-5 rounded-2xl transform transition hover:scale-105 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Sync everywhere</p>
                  <p className="text-sm text-slate-500 mt-1">History, flashcards, and retry points follow you across devices.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 右侧：表单区 */}
        <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_EMAIL}
                className="input-field mt-2 transition-all focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={DEMO_PASSWORD}
                className="input-field mt-2 transition-all focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3 animate-slide-up" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <FancyButton
              type="submit"
              variant="solid"
              className="w-full justify-center transform transition hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  logging in…
                </span>
              ) : (
                'log in'
              )}
            </FancyButton>
          </form>

          {/* Demo 账号卡片 */}
          <div className="mt-6 glass-outline rounded-2xl px-5 py-4 text-sm border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold uppercase text-blue-600">Demo Account</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2">
                <span className="text-slate-600 text-xs">Email:</span>
                <span className="font-mono text-sm font-medium">{DEMO_EMAIL}</span>
              </div>
              <div className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2">
                <span className="text-slate-600 text-xs">Password:</span>
                <span className="font-mono text-sm font-medium">{DEMO_PASSWORD}</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an account?
            <Link href="/register" className="brand-link ml-2 font-semibold hover:text-blue-700 transition">
              sign up
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
