'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { setAuthCookies } from '@/lib/cookies'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const search = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 模擬登入驗證
    if (email === 'admin@test.com' && password === '123456') {
      // 設定認證 Cookies（取代 localStorage）
      setAuthCookies(email)
      // 有 next 參數就導回原頁
      const next = search.get('next')
      router.push(next && next.startsWith('/') ? next : '/dashboard')
    } else {
      setError('帳號或密碼錯誤')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo 區域 */}
        <div className="text-center mb-8">
          <Image
            src="/logo/interviewPlus_logo.png"
            alt="InterviewPlus Logo"
            width={200}
            height={60}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900">歡迎回來</h1>
          <p className="text-gray-600 mt-2">請登入您的帳號</p>
        </div>

        {/* 登入表單 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 電子郵件輸入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                電子郵件
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="請輸入您的電子郵件"
                required
              />
            </div>

            {/* 密碼輸入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="請輸入您的密碼"
                required
              />
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 登入按鈕 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  登入中...
                </div>
              ) : (
                '登入'
              )}
            </button>
          </form>

          {/* 註冊連結 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              還沒有帳號？{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                立即註冊
              </Link>
            </p>
          </div>

          {/* 測試帳號提示 */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              測試帳號：admin@test.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
