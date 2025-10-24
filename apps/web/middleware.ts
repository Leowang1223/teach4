import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/prepare') ||
    pathname.startsWith('/interview') ||
    pathname.startsWith('/analysis')

  if (isProtected) {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/prepare/:path*', '/interview/:path*', '/analysis/:path*']
}


