import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAuthResponse,
  IValidateTokenResponseType,
} from '@/lib/types/interfaces/apis/auth.interfaces'
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'
import { cookies } from 'next/headers'

/**
 * Set authentication cookies after successful auth
 * @param data - Auth response data containing tokens
 */
async function setAuthCookies(data: IApiResponseWrapperType<IAuthResponse>) {
  const cookieStore = await cookies()
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  }
  cookieStore.set('accessToken', data.data.accessToken, opts)
  cookieStore.set('userId', data.data.user.id, opts)
}

/**
 * Clear authentication cookies
 */
async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('userId')
}

/**
 * Login user with credentials
 * @param credentials - User login credentials
 * @returns Auth response with user data
 * @throws Error with backend message
 */
export async function loginServerAPI(credentials: {
  email: string
  password: string
}): Promise<IApiResponseWrapperType<IAuthResponse>> {
  const data = await kyInstance
    .post('auth/login', {
      json: credentials,
    })
    .json<IApiResponseWrapperType<IAuthResponse>>()

  await setAuthCookies(data)
  return data
}

/**
 * Register new user
 * @param userData - User registration data
 * @returns Auth response with user data
 * @throws Error with backend message
 */
export async function registerServerAPI(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  username?: string
}): Promise<IApiResponseWrapperType<IAuthResponse>> {
  const data = await kyInstance
    .post('auth/register', {
      json: userData,
    })
    .json<IApiResponseWrapperType<IAuthResponse>>()

  await setAuthCookies(data)
  return data
}

/**
 * Refresh access token
 * @param accessToken - Current access token
 * @returns Auth response with new token
 * @throws Error with backend message
 */
export async function refreshTokenServerAPI(
  accessToken: string,
): Promise<IApiResponseWrapperType<IAuthResponse>> {
  const data = await kyInstance
    .post('auth/refresh-token', {
      json: { accessToken },
    })
    .json<IApiResponseWrapperType<IAuthResponse>>()

  await setAuthCookies(data)
  return data
}

/**
 * Logout user and clear session
 * @throws Error with backend message
 */
export async function logoutServerAPI(): Promise<void> {
  try {
    await kyInstance.post('auth/logout')
  } catch {
    // Intentionally swallowed — cookie cleanup must always happen
  } finally {
    await clearAuthCookies()
  }
}

/**
 * Validate access token
 * @param accessToken - Access token to validate
 * @returns Validation response with user data
 */
export async function validateTokenServerAPI(accessToken: string): Promise<{
  isAuthenticated: boolean
  user: IUserDataType | null
  expiresAt?: string
}> {
  try {
    const data = await kyInstance
      .get('auth/validate-token', { headers: { accessToken } })
      .json<IApiResponseWrapperType<IValidateTokenResponseType>>()

    return {
      isAuthenticated: data.data.valid,
      user: data.data.user,
      expiresAt: data.data.expiresAt,
    }
  } catch (error) {
    // Clear cookies if token is invalid/expired
    if (error instanceof Error && error.message.includes('401')) {
      await clearAuthCookies()
    }
    return { isAuthenticated: false, user: null }
  }
}
