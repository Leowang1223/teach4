'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { setAuthCookies } from '@/lib/cookies'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 基本驗證
    if (formData.password !== formData.confirmPassword) {
      setError('密碼確認不一致')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('密碼長度至少需要6個字符')
      setIsLoading(false)
      return
    }

    // 模擬註冊成功
    try {
      // 模擬 API 呼叫延遲
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 設定登入狀態（直接登入）
      setAuthCookies(formData.email)
      // 導向到 dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('註冊失敗，請稍後再試')
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
          <h1 className="text-2xl font-bold text-gray-900">建立新帳號</h1>
          <p className="text-gray-600 mt-2">請填寫以下資訊完成註冊</p>
        </div>

        {/* 註冊表單 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 姓名輸入 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="請輸入您的姓名"
                required
              />
            </div>

            {/* 電子郵件輸入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="請輸入密碼（至少6個字符）"
                required
              />
            </div>

            {/* 確認密碼輸入 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                確認密碼
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="請再次輸入密碼"
                required
              />
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 註冊按鈕 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  註冊中...
                </div>
              ) : (
                '建立帳號'
              )}
            </button>
          </form>

          {/* 登入連結 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已經有帳號了？{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                立即登入
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}