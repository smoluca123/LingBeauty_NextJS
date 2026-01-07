import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import type {
  ILoginCredentials,
  IRegisterData,
} from '@/lib/types/interfaces/apis/auth.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { HTTPError } from 'ky';

interface AuthApiResponse {
  message: string;
  data?: { user: IUserDataType };
}

interface GetAuthResponse {
  isAuthenticated: boolean;
  user: IUserDataType | null;
  expiresAt: Date | null;
}

export async function loginApi(
  credentials: ILoginCredentials
): Promise<IUserDataType> {
  try {
    const data = await kyNextInstance
      .post('auth/login', { json: credentials })
      .json<AuthApiResponse>();

    if (!data.data?.user) {
      throw new Error('Invalid response from server');
    }

    return data.data.user;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    throw error;
  }
}

export async function registerApi(
  registerData: IRegisterData
): Promise<IUserDataType> {
  try {
    const data = await kyNextInstance
      .post('auth/register', { json: registerData })
      .json<AuthApiResponse>();

    if (!data.data?.user) {
      throw new Error('Invalid response from server');
    }

    return data.data.user;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    throw error;
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await kyNextInstance.post('auth/logout');
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Logout failed');
    }
    throw error;
  }
}

export async function refreshTokenApi(): Promise<IUserDataType> {
  try {
    const data = await kyNextInstance
      .post('auth/refresh')
      .json<AuthApiResponse>();

    if (!data.data?.user) {
      throw new Error('Invalid response from server');
    }

    return data.data.user;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Token refresh failed');
    }
    throw error;
  }
}

// export async function getCurrentUserApi(): Promise<GetAuthResponse> {
//   try {
//     const data = await kyNextInstance.get('auth/me').json<GetAuthResponse>();
//     return data;
//   } catch {
//     return { isAuthenticated: false, user: null, expiresAt: null };
//   }
// }

export async function validateTokenApi(): Promise<GetAuthResponse> {
  try {
    const data = await kyNextInstance
      .get('auth/validate-token')
      .json<GetAuthResponse>();
    return data;
  } catch {
    return { isAuthenticated: false, user: null, expiresAt: null };
  }
}

// ============ Email Verification APIs ============

interface SendOTPResponse {
  message: string;
  code?: string; // Only in development mode
}

interface VerifyEmailResponse {
  message: string;
}

export interface RateLimitError {
  message: string;
  remainingCooldown: number;
}

export async function sendEmailVerificationApi(): Promise<SendOTPResponse> {
  try {
    const data = await kyNextInstance
      .post('auth/send-email-verification')
      .json<{ message: string; data?: SendOTPResponse }>();

    return data.data || { message: data.message };
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      // Check for rate limit error (429)
      if (error.response.status === 429) {
        const rateLimitError: RateLimitError = {
          message: errorData.message || 'Too many requests',
          remainingCooldown: errorData.details?.remainingCooldown || 0,
        };
        throw rateLimitError;
      }
      throw new Error(errorData.message || 'Failed to send verification email');
    }
    throw error;
  }
}

export async function verifyEmailApi(
  code: string
): Promise<VerifyEmailResponse> {
  try {
    const data = await kyNextInstance
      .post('auth/verify-email', { json: { code } })
      .json<{ message: string; data?: VerifyEmailResponse }>();

    return data.data || { message: data.message };
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to verify email');
    }
    throw error;
  }
}

export async function resendEmailVerificationApi(): Promise<SendOTPResponse> {
  try {
    const data = await kyNextInstance
      .post('auth/resend-email-verification')
      .json<{ message: string; data?: SendOTPResponse }>();

    return data.data || { message: data.message };
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      // Check for rate limit error (429)
      if (error.response.status === 429) {
        const rateLimitError: RateLimitError = {
          message: errorData.message || 'Too many requests',
          remainingCooldown: errorData.details?.remainingCooldown || 0,
        };
        throw rateLimitError;
      }
      throw new Error(
        errorData.message || 'Failed to resend verification email'
      );
    }
    throw error;
  }
}
