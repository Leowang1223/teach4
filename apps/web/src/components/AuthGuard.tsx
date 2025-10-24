'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookies'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isLoggedIn = getCookie('isLoggedIn')
        if (isLoggedIn === 'true') {
          setIsAuthenticated(true)
        } else {
          router.replace('/login')
          return
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
