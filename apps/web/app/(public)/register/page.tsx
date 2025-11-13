'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FancyButton from '@/components/ui/FancyButton'
import { setAuthCookies } from '@/lib/cookies'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    setAuthCookies(form.email.trim())
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="glass-card w-full max-w-5xl p-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <p className="chip">Talk Learning</p>
          <h1 className="hero-title text-left">sign up</h1>
          <p className="hero-subtitle text-left">Build your personalised Mandarin journey with glass-smooth UI.</p>
          <ul className="space-y-4">
            <li className="glass-outline rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-700">Structured lesson path</p>
              <p className="text-sm text-slate-500 mt-1">Unlock lessons sequentially and watch the route glow in blue.</p>
            </li>
            <li className="glass-outline rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-700">Smart flashcards</p>
              <p className="text-sm text-slate-500 mt-1">Every low-score question becomes a flashcard automatically.</p>
            </li>
          </ul>
        </section>

        <section>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="text-sm font-medium text-slate-600">Name</label>
              <input id="register-name" className="input-field mt-2" value={form.name} onChange={updateField('name')} />
            </div>
            <div>
              <label htmlFor="register-email" className="text-sm font-medium text-slate-600">Email</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                className="input-field mt-2"
                value={form.email}
                onChange={updateField('email')}
                required
              />
            </div>
            <div>
              <label htmlFor="register-password" className="text-sm font-medium text-slate-600">Password</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                className="input-field mt-2"
                value={form.password}
                onChange={updateField('password')}
                required
              />
            </div>
            <div>
              <label htmlFor="register-confirm" className="text-sm font-medium text-slate-600">Confirm password</label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                className="input-field mt-2"
                value={form.confirm}
                onChange={updateField('confirm')}
                required
              />
            </div>
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            <FancyButton type="submit" variant="solid" className="w-full justify-center">
              {loading ? 'creating account…' : 'create account'}
            </FancyButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?
            <Link href="/login" className="brand-link ml-2 font-semibold">log in</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
