import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo/interviewPlus_logo.png"
            alt="InterviewPlus Logo"
            width={300}
            height={80}
            className="mx-auto mb-6"
            priority
          />
        </div>
        <p className="text-center mb-8 text-lg">
          透過 AI 驅動的模擬面試練習你的面試技巧
        </p>
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link 
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              登入
            </Link>
            <Link 
              href="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-6 rounded-lg border-2 border-blue-600 transition-colors"
            >
              註冊
            </Link>
          </div>
          <div className="pt-4">
            <Link 
              href="/prepare"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              直接開始模擬面試 →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
