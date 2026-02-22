'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IChangePasswordResponse } from '@/lib/types/interfaces/apis/auth.interfaces';
import { ChangePasswordValues } from '@/lib/zod-schemas/auth.schema';

export const changeUserPasswordAPI = async ({
  currentPassword,
  newPassword,
}: ChangePasswordValues) => {
  try {
    const data = await kyInstance
      .post('auth/change-password', {
        json: { currentPassword, newPassword },
      })
      .json<IApiResponseWrapperType<IChangePasswordResponse>>();

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
