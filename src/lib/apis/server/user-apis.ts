'use server';
import { env } from '@/lib/env.config';
import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IValidateTokenResponseType } from '@/lib/types/interfaces/apis/auth.interfaces';
import { IUserDataWithAccessTokenType } from '@/lib/types/interfaces/apis/user.interfaces';
import { LoginValues, RegisterValues } from '@/lib/zod-schemas/auth.schema';
import { UpdateUserInfomationValues } from '@/lib/zod-schemas/user-schema';
import ky from 'ky';
import { cookies } from 'next/headers';

export const signInApi = async (
  credentials: LoginValues
): Promise<
  | {
      success: true;
      data: IApiResponseWrapperType<IUserDataWithAccessTokenType>;
    }
  | {
      success: false;
      message: string;
    }
> => {
  try {
    const data = await kyInstance
      .post('auth/signin', { json: credentials })
      .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();
    return {
      success: true,
      data: data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();

      if (Array.isArray(errorData.message)) {
        return {
          success: false,
          message: errorData.message,
        };
      } else {
        return {
          success: false,
          message: errorData.message,
        };
      }
    }
    return {
      success: false,
      message: error.message,
    };
  }
};

export const signUpApi = async (
  credentials: RegisterValues
): Promise<
  | {
      success: true;
      data: IApiResponseWrapperType<IUserDataWithAccessTokenType>;
    }
  | { success: false; message: string }
> => {
  try {
    const data = await kyInstance
      .post('auth/signup', { json: credentials })
      .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();
    return {
      success: true,
      data: data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      if (Array.isArray(errorData.message)) {
        return {
          success: false,
          message: errorData.message[0],
        };
      } else {
        return {
          success: false,
          message: errorData.message,
        };
      }
    }
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};

// export const getMeApi = async () => {
//   try {
//     const data = await kyInstance
//       .get('auth/validate-token')
//       .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();
//     return data;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     if (error.response) {
//       const errorData = await error.response.json();
//       throw errorData.message;
//     }
//     throw error.message;
//   }
// };

export const validateAccessTokenApi = async (payload?: {
  accessToken?: string;
}): Promise<
  | {
      success: true;
      data: IApiResponseWrapperType<IValidateTokenResponseType>;
    }
  | { success: false; message: string }
> => {
  try {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get('accessToken');

    if (!payload?.accessToken && !accessTokenCookie) {
      return {
        success: false,
        message: 'No access token found',
      };
    }

    const data = await kyInstance
      .get(`auth/validate-token`, {
        headers: {
          // Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
          accessToken: payload?.accessToken || accessTokenCookie?.value,
        },
      })
      .json<IApiResponseWrapperType<IValidateTokenResponseType>>();
    return {
      success: true,
      data: data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // throw error;
    return {
      success: false,
      message: error.message,
    };
  }
};

export const refreshAccessTokenApi = async (payload?: {
  accessToken?: string;
}) => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get('accessToken');
  if (!accessTokenCookie) {
    throw new Error('No access token found');
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
      >();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const updateUserInfomationAPI = async (
  userData: UpdateUserInfomationValues
) => {
  try {
    const data = await kyInstance
      .patch(`user/me`, {
        json: userData,
      })
      .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();

    return data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const changeUserPasswordAPI = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const data = await kyInstance
      .put('auth/change-password', {
        json: { oldPassword, newPassword },
      })
      .json<IApiResponseWrapperType<IUserDataWithAccessTokenType>>();

    return data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
