// Dashboard‑Style Optimized Button Component
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface AppButtonProps {
  variant?: 'primary' | 'danger'
  children: React.ReactNode
  icon?: LucideIcon
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
}

// Dashboard 風格：柔和白底 + 淡邊框 + 微陰影 + 圓角 2xl
export const AppButton = ({
  variant = 'primary',
  children,
  icon: Icon,
  onClick,
  disabled = false,
  className = ''
}: AppButtonProps) => {
  const base =
    'w-full max-w-md flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-sm border transition-all active:scale-[0.97] text-sm disabled:opacity-50 disabled:cursor-not-allowed'

  const styles =
    variant === 'primary'
      ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:shadow-md'
      : 'bg-white border-red-300 text-red-600 hover:bg-red-50 hover:shadow-md'

  return (
    <button
      className={`${base} ${styles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={18} className="opacity-80" />}
      {children}
    </button>
  )
}
