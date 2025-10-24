'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface TopbarProps {
  userEmail: string
  onLogout: () => void
}

export default function Topbar({ userEmail, onLogout }: TopbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="brand">
        <Image 
          src="/logo/interviewPlus_logo.png" 
          alt="InterviewPlus" 
          width={120} 
          height={32}
          className="h-8 w-auto"
        />
      </div>
      <div className="top-actions">
        <div className="relative">
          <div 
            className="avatar" 
            title={userEmail}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{userEmail}</div>
                  <div className="text-gray-500">管理員</div>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  個人設定
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  帳號管理
                </a>
                <div className="border-t">
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    登出
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
