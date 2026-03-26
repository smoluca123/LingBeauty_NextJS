import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import { type UpdateUserInfoValues } from '@/lib/schemas/user.schema'

/**
 * Upload user avatar
 * Calls the Next.js proxy route handler, which forwards to the real backend
 * @param avatar - Avatar file to upload
 * @returns Promise with updated user data
 * @throws Error with backend message
 */
export const uploadAvatarAPI = async ({
  avatar,
}: {
  avatar: File
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const formData = new FormData()
    formData.append('file', avatar)

    const data = await kyNextInstance
      .post('me/avatar', { body: formData })
      .json<IApiResponseWrapperType<IUserDataType>>()
    return data
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Cập nhật ảnh đại diện thất bại'),
    )
  }
}

/**
 * Update current user's information
 * @param userData - User data to update
 * @returns Promise with updated user data
 * @throws Error with backend message
 */
export const updateMyInformationAPI = async (
  userData: UpdateUserInfoValues,
): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const data = await kyNextInstance
      .patch('me', { json: userData })
      .json<IApiResponseWrapperType<IUserDataType>>()
    return data
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Cập nhật thông tin thất bại'),
    )
  }
}
