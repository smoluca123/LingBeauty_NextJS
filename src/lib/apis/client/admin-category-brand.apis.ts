import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  ICategoryDataType,
  IBrandDataType,
} from '@/lib/types/interfaces/apis/header.interfaces'

/**
 * Get all categories (Admin)
 * @returns Promise with categories array
 * @throws Error with backend message
 */
export const getAllAdminCategoriesClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/categories')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch categories'),
    )
  }
}

/**
 * Create category (Admin - multipart/form-data)
 * @param formData - Form data containing category information
 * @returns Promise with created category data
 * @throws Error with backend message
 */
export const createCategoryClientAPI = async (formData: FormData) => {
  try {
    return await kyNextInstance
      .post('admin/categories', { body: formData })
      .json<IApiResponseWrapperType<ICategoryDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create category'),
    )
  }
}

/**
 * Create sub-category (Admin - multipart/form-data)
 * @param parentId - Parent category ID
 * @param formData - Form data containing sub-category information
 * @returns Promise with created sub-category data
 * @throws Error with backend message
 */
export const createSubCategoryClientAPI = async (
  parentId: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .post(`admin/categories/${parentId}/sub-category`, { body: formData })
      .json<IApiResponseWrapperType<ICategoryDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create sub-category'),
    )
  }
}

/**
 * Update category (Admin - multipart/form-data)
 * @param id - Category ID to update
 * @param formData - Form data containing updated category information
 * @returns Promise with updated category data
 * @throws Error with backend message
 */
export const updateCategoryClientAPI = async (
  id: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/categories/${id}`, { body: formData })
      .json<IApiResponseWrapperType<ICategoryDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update category'),
    )
  }
}

/**
 * Delete category (Admin)
 * @param id - Category ID to delete
 * @returns Promise with deleted category data
 * @throws Error with backend message
 */
export const deleteCategoryClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/categories/${id}`)
      .json<IApiResponseWrapperType<ICategoryDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete category'),
    )
  }
}

/**
 * Get all brands (Admin)
 * @returns Promise with paginated brand data
 * @throws Error with backend message
 */
export const getAllAdminBrandsClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/brands')
      .json<IApiPaginationResponseWrapperType<IBrandDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch brands'))
  }
}
