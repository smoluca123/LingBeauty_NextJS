import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============ Route Configuration ============

/**
 * Routes that require user authentication
 * Users will be redirected to home with login modal if not authenticated
 */
const PROTECTED_ROUTES = [
  '/profile',
  '/orders',
  '/checkout',
  '/settings',
] as const

/**
 * Routes that require admin authentication
 * Users will be redirected to login page if not authenticated
 */
const ADMIN_ROUTES = ['/admin'] as const

/**
 * Authentication pages that should redirect to home if user is already authenticated
 */
const AUTH_ROUTES = ['/login', '/register'] as const

// ============ Query Parameter Constants ============

const QUERY_PARAMS = {
  LOGIN: 'login',
  REDIRECT: 'redirect',
} as const

// ============ Helper Functions ============

/**
 * Check if pathname matches any route in the given array
 */
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => pathname.startsWith(route))
}

/**
 * Create redirect URL with query parameters
 */
function createRedirectUrl(
  baseUrl: string,
  requestUrl: string,
  params?: Record<string, string>,
): URL {
  const url = new URL(baseUrl, requestUrl)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url
}

// ============ Middleware ============

/**
 * Next.js middleware for authentication and route protection
 *
 * Handles three types of routes:
 * 1. Admin routes - require authentication, redirect to /login
 * 2. Protected routes - require authentication, redirect to / with login modal
 * 3. Auth routes - redirect to / if already authenticated
 *
 * @param request - Next.js request object
 * @returns NextResponse with redirect or next()
 */
export function proxy(request: NextRequest): NextResponse {
  const accessToken = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl
  const isAuthenticated = !!accessToken

  // Early return: Admin routes require authentication
  if (matchesRoute(pathname, ADMIN_ROUTES)) {
    if (!isAuthenticated) {
      const loginUrl = createRedirectUrl('/login', request.url, {
        [QUERY_PARAMS.REDIRECT]: pathname,
      })
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Early return: Protected routes require authentication
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      const homeUrl = createRedirectUrl('/', request.url, {
        [QUERY_PARAMS.LOGIN]: 'true',
        [QUERY_PARAMS.REDIRECT]: pathname,
      })
      return NextResponse.redirect(homeUrl)
    }
    return NextResponse.next()
  }

  // Early return: Auth routes redirect to home if authenticated
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Default: Allow request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
