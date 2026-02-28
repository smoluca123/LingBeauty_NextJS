'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IChangePasswordResponse } from '@/lib/types/interfaces/apis/auth.interfaces';
import type { ChangePasswordValues } from '@/lib/zod-schemas/auth.schema';

export const changeUserPasswordAPI = async ({
  currentPassword,
  newPassword,
}: ChangePasswordValues) =>
  kyInstance
    .post('auth/change-password', { json: { currentPassword, newPassword } })
    .json<IApiResponseWrapperType<IChangePasswordResponse>>();
