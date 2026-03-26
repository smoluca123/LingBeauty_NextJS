import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import {
  IApiResponseWrapperType,
  INextApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAuthApiResponse,
  IChangePasswordData,
  IChangePasswordError,
  IChangePasswordResponse,
  IGetAuthResponse,
  ILoginCredentials,
  IRegisterData,
} from '@/lib/types/interfaces/apis/auth.interfaces'
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import { HTTPError } from 'ky'

/**
 * Login user with credentials
 * @param credentials - User login credentials (email and password)
 * @returns Promise with user data
 * @throws Error with backend message
 */
export async function loginApi(
  credentials: ILoginCredentials,
): Promise<IUserDataType> {
  try {
    const data = await kyNextInstance
      .post('auth/login', { json: credentials })
      .json<IAuthApiResponse>()

    if (!data.data?.user) {
      throw new Error('Invalid response from server')
    }

    return data.data.user
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Login failed'))
  }
}

/**
 * Register new user account
 * @param registerData - User registration data
 * @returns Promise with user data
 * @throws Error with backend message
 */
export async function registerApi(
  registerData: IRegisterData,
): Promise<IUserDataType> {
  try {
    const data = await kyNextInstance
      .post('auth/register', { json: registerData })
      .json<IAuthApiResponse>()

    if (!data.data?.user) {
      throw new Error('Invalid response from server')
    }

    return data.data.user
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Registration failed'))
  }
}

/**
 * Logout current user
 * @returns Promise that resolves when logout is complete
 * @throws Error with backend message
 */
export async function logoutApi(): Promise<void> {
  try {
    await kyNextInstance.post('auth/logout')
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Logout failed'))
  }
}

/**
 * Refresh authentication token
 * @returns Promise with updated user data
 * @throws Error with backend message
 */
export async function refreshTokenApi(): Promise<IUserDataType> {
  try {
    const data = await kyNextInstance
      .post('auth/refresh')
      .json<IAuthApiResponse>()

    if (!data.data?.user) {
      throw new Error('Invalid response from server')
    }

    return data.data.user
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Token refresh failed'))
  }
}

/**
 * Validate current authentication token
 * @returns Promise with authentication status and user data
 */
export async function validateTokenApi(): Promise<IGetAuthResponse> {
  try {
    const data = await kyNextInstance
      .get('auth/validate-token')
      .json<IGetAuthResponse>()
    return data
  } catch {
    return { isAuthenticated: false, user: null, expiresAt: null }
  }
}

// ============ Email Verification APIs ============

interface SendOTPResponse {
  message: string
  code?: string // Only in development mode
}

interface VerifyEmailResponse {
  message: string
}

export interface RateLimitError {
  message: string
  remainingCooldown: number
}

/**
 * Send email verification OTP to user's email
 * @returns Promise with OTP response (includes code in development mode)
 * @throws Error with backend message or RateLimitError if rate limited
 */
export async function sendEmailVerificationApi(): Promise<SendOTPResponse> {
  try {
    const data = await kyNextInstance
      .post('auth/send-email-verification')
      .json<{ message: string; data?: SendOTPResponse }>()

    return data.data || { message: data.message }
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json()
      // Check for rate limit error (429)
      if (error.response.status === 429) {
        const rateLimitError: RateLimitError = {
          message: errorData.message || 'Too many requests',
          remainingCooldown: errorData.details?.remainingCooldown || 0,
        }
        throw rateLimitError
      }
      throw new Error(errorData.message || 'Failed to send verification email')
    }
    throw error
  }
}

/**
 * Verify user's email with OTP code
 * @param code - OTP code received via email
 * @returns Promise with verification response
 * @throws Error with backend message
 */
export async function verifyEmailApi(
  code: string,
): Promise<VerifyEmailResponse> {
  try {
    const data = await kyNextInstance
      .post('auth/verify-email', { json: { code } })
      .json<{ message: string; data?: VerifyEmailResponse }>()

    return data.data || { message: data.message }
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to verify email'))
  }
}

/**
 * Resend email verification OTP
 * @returns Promise with OTP response (includes code in development mode)
 * @throws Error with backend message or RateLimitError if rate limited
 */
export async function resendEmailVerificationApi(): Promise<SendOTPResponse> {
  try {
    const data = await kyNextInstance
      .post('auth/resend-email-verification')
      .json<{ message: string; data?: SendOTPResponse }>()

    return data.data || { message: data.message }
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json()
      // Check for rate limit error (429)
      if (error.response.status === 429) {
        const rateLimitError: RateLimitError = {
          message: errorData.message || 'Too many requests',
          remainingCooldown: errorData.details?.remainingCooldown || 0,
        }
        throw rateLimitError
      }
      throw new Error(
        errorData.message || 'Failed to resend verification email',
      )
    }
    throw error
  }
}

// ============ Change Password API ============

/**
 * Change user's password
 * @param data - Change password data (current password and new password)
 * @returns Promise with change password response
 * @throws Error with backend message
 */
export async function changePasswordAPI(
  data: IChangePasswordData,
): Promise<
  INextApiResponseWrapperType<IApiResponseWrapperType<IChangePasswordResponse>>
> {
  try {
    const response = await kyNextInstance
      .post('auth/change-password', { json: data })
      .json<
        INextApiResponseWrapperType<
          IApiResponseWrapperType<IChangePasswordResponse>
        >
      >()

    return response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof HTTPError) {
      const errorData = (await error.response.json()) as IChangePasswordError
      throw errorData.message
    }
    throw error.message
  }
}
