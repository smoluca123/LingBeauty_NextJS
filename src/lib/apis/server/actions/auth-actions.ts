'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type { IChangePasswordResponse } from '@/lib/types/interfaces/apis/auth.interfaces'
import type { ChangePasswordValues } from '@/lib/schemas/auth.schema'

/**
 * Change user password
 * @param credentials - Current and new password
 * @returns Password change response
 * @throws Error with backend message if request fails
 */
export const changeUserPasswordAPI = async ({
  currentPassword,
  newPassword,
}: ChangePasswordValues) =>
  kyInstance
    .post('auth/change-password', { json: { currentPassword, newPassword } })
    .json<IApiResponseWrapperType<IChangePasswordResponse>>()
