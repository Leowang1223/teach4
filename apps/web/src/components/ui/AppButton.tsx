import { type LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type AppButtonVariant = 'primary' | 'danger'

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

const baseStyles =
  'w-full max-w-md flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-sm border transition-all active:scale-[0.97] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const variantStyles: Record<AppButtonVariant, string> = {
  primary: 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:shadow-md focus-visible:ring-blue-200',
  danger: 'bg-white border-red-300 text-red-600 hover:bg-red-50 hover:shadow-md focus-visible:ring-red-200'
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ variant = 'primary', icon: Icon, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {Icon && <Icon size={18} className="opacity-80" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  )
)

AppButton.displayName = 'AppButton'
