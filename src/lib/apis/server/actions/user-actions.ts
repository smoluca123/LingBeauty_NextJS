'use server'
import { env } from '@/lib/env.config'
import { kyInstance } from '@/lib/kyInstance/ky'
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { IValidateTokenResponseType } from '@/lib/types/interfaces/apis/auth.interfaces'
import {
  IUserDataType,
  IUserDataWithAccessTokenType,
} from '@/lib/types/interfaces/apis/user.interfaces'
import { type UpdateUserInfoValues } from '@/lib/schemas/user.schema'
import ky from 'ky'
import { cookies } from 'next/headers'

// export const signInApi = async (
//   credentials: LoginValues,
// ): Promise<
//   | {
//       success: true;
//       data: IApiResponseWrapperType<IUserDataWithAccessTokenType>;
//     }
//   | {
//       success: false;
//       message: string;
//     }
// > => {
//   try {
//     const data = await kyInstance
//       .post('auth/signin', { json: credentials })
//       .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();
//     return {
//       success: true,
//       data: data,
//     };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     if (error.response) {
//       const errorData = await error.response.json();

//       if (Array.isArray(errorData.message)) {
//         return {
//           success: false,
//           message: errorData.message,
//         };
//       } else {
//         return {
//           success: false,
//           message: errorData.message,
//         };
//       }
//     }
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };

// export const signUpApi = async (
//   credentials: RegisterValues,
// ): Promise<
//   | {
//       success: true;
//       data: IApiResponseWrapperType<IUserDataWithAccessTokenType>;
//     }
//   | { success: false; message: string }
// > => {
//   try {
//     const data = await kyInstance
//       .post('auth/signup', { json: credentials })
//       .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();
//     return {
//       success: true,
//       data: data,
//     };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     if (error.response) {
//       const errorData = await error.response.json();
//       if (Array.isArray(errorData.message)) {
//         return {
//           success: false,
//           message: errorData.message[0],
//         };
//       } else {
//         return {
//           success: false,
//           message: errorData.message,
//         };
//       }
//     }
//     return {
//       success: false,
//       message: 'Something went wrong',
//     };
//   }
// };

/**
 * Validate access token
 * @param payload - Optional access token to validate
 * @returns Validation result with user data or error message
 * @throws Error with backend message if request fails
 */
export const validateAccessTokenApi = async (payload?: {
  accessToken?: string
}): Promise<
  | {
      success: true
      data: IApiResponseWrapperType<IValidateTokenResponseType>
    }
  | { success: false; message: string }
> => {
  try {
    const cookieStore = await cookies()
    const accessTokenCookie = cookieStore.get('accessToken')

    if (!payload?.accessToken && !accessTokenCookie) {
      return {
        success: false,
        message: 'No access token found',
      }
    }

    const data = await kyInstance
      .get(`auth/validate-token`, {
        headers: {
          // Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
          accessToken: payload?.accessToken || accessTokenCookie?.value,
        },
      })
      .json<IApiResponseWrapperType<IValidateTokenResponseType>>()
    return {
      success: true,
      data: data,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // throw error;
    return {
      success: false,
      message: error.message,
    }
  }
}

/**
 * Refresh access token
 * @param payload - Optional access token to refresh
 * @returns New access token and user data
 * @throws Error with backend message if request fails
 */
export const refreshAccessTokenApi = async (payload?: {
  accessToken?: string
}) => {
  const cookieStore = await cookies()
  const accessTokenCookie = cookieStore.get('accessToken')
  if (!accessTokenCookie) {
    throw new Error('No access token found')
  }

  try {
    const data = await ky
      .post(`${env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
        json: { accessToken: payload?.accessToken || accessTokenCookie?.value },
        headers: {
          Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
          accessToken: payload?.accessToken || accessTokenCookie?.value,
        },
      })
      .json<
        IApiResponseWrapperType<
          IUserDataWithAccessTokenType & { accessToken: string }
        >
      >()
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json()
      throw errorData.message
    }
    throw error.message
  }
}

/**
 * Update current user information
 * @param userData - User data to update
 * @returns Updated user data with access token
 * @throws Error with backend message if request fails
 */
export const updateMyInformationAPI = async (
  userData: UpdateUserInfoValues,
) => {
  // Let HTTPError bubble up naturally — proxyRoute in the route handler
  // will forward the exact BE response (status + body) to the client.
  return kyInstance
    .patch(`user/me`, { json: userData })
    .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>()
}

/**
 * Upload avatar (Server Action)
 * @param file - Avatar image file to upload
 * @returns Updated user data with new avatar
 * @throws Error with backend message if request fails
 */
export const uploadAvatarServerApi = async (
  file: File,
): Promise<IApiResponseWrapperType<IUserDataType>> => {
  const formData = new FormData()
  formData.append('file', file)
  return kyInstance
    .post('user/upload/avatar', { body: formData })
    .json<IApiResponseWrapperType<IUserDataType>>()
}
