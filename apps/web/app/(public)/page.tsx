import Link from 'next/link'
import FancyButton from '@/components/ui/FancyButton'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="text-center space-y-12 max-w-2xl mx-auto">
        <div className="glass-card px-16 py-20 space-y-8 shadow-2xl">
          <p className="chip mx-auto">Talk Learning</p>
          <h1 className="hero-title">talk learning</h1>
          <p className="hero-subtitle text-lg mt-6">
            Master Chinese through interactive conversations
          </p>
          <div className="flex flex-wrap gap-5 justify-center pt-4">
            <Link href="/login">
              <FancyButton variant="solid">log in</FancyButton>
            </Link>
            <Link href="/register">
              <FancyButton variant="outline">sign up</FancyButton>
            </Link>
          </div>
        </div>
        <Link href="/prepare" className="text-sm text-slate-500 hover:text-slate-700 transition inline-block">
          preview a lesson flow →
        </Link>
      </div>
    </main>
  )
}
