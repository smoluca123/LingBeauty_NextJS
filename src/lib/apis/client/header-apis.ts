import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Fetch all categories
 * @returns Promise with categories data
 * @throws Error with backend message
 */
export const getCategoriesAPI = async (): Promise<
  IApiResponseWrapperType<ICategoryDataType[]>
> => {
  try {
    const response = await kyNextInstance
      .get('category')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch categories'),
    )
  }
}
