'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', description: 'Overview & path', icon: LayoutDashboard },
  { href: '/conversation', label: 'AI Conversation', description: 'Practice with AI', icon: MessageSquare },
  { href: '/flashcards', label: 'Flashcards', description: 'Review mistakes', icon: BookOpen },
  { href: '/history', label: 'History', description: 'Reports & playback', icon: History },
]

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // 從 localStorage 讀取折疊狀態
  useEffect(() => {
    const collapsed = localStorage.getItem('sidebarCollapsed')
    if (collapsed === 'true') {
      setIsCollapsed(true)
    }
  }, [])

  // 切換折疊狀態
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  // 處理登出
  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <aside
      className={`
        relative border-r border-white/70 bg-[#f6f8fe]/90
        py-10 shadow-[0_15px_40px_rgba(148,163,184,0.25)] backdrop-blur
        transition-all duration-300 ease-in-out
        flex-shrink-0
        ${isCollapsed ? 'w-16' : 'w-72'}
      `}
    >
      {/* Logo / Title */}
      <div className={`mb-7 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-7'}`}>
        {!isCollapsed && (
          <button className="self-start rounded-full border border-blue-100 bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm transition-opacity duration-300">
            Talk Learning
          </button>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              TL
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div className={`mt-7 space-y-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-7'}`}>
        <div>
          {!isCollapsed && (
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Navigate
            </div>
          )}

          <div className="space-y-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`
                    w-full flex items-center gap-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/60 text-slate-700 hover:bg-white hover:shadow-sm'
                    }
                    ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-[11px] opacity-70">{item.description}</div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="
          absolute -right-3 top-10
          w-6 h-6 rounded-full
          bg-white border border-gray-200
          shadow-md hover:shadow-lg
          flex items-center justify-center
          transition-all duration-200
          hover:scale-110
          z-10
        "
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logout Button (底部) */}
      <div className={`absolute bottom-10 left-0 right-0 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-7'}`}>
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 rounded-xl
            bg-red-50 text-red-600 hover:bg-red-100
            transition-all duration-200
            ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
