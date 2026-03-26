import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type { IAdminBrandDataType } from '@/lib/types/interfaces/apis/admin-brand.interfaces'

/**
 * Get all brands with pagination and search (Admin)
 * @param params - Pagination and search parameters
 * @returns Promise with paginated brand data
 * @throws Error with backend message
 */
export const getAllAdminBrandsPagedClientAPI = async (params?: {
  page?: number
  limit?: number
  search?: string
  order?: 'asc' | 'desc'
}) => {
  try {
    const searchParams: Record<string, string> = {}
    if (params?.page) searchParams.page = String(params.page)
    if (params?.limit) searchParams.limit = String(params.limit)
    if (params?.search) searchParams.search = params.search
    if (params?.order) searchParams.order = params.order

    return await kyNextInstance
      .get('admin/brands', { searchParams })
      .json<IApiPaginationResponseWrapperType<IAdminBrandDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch brands'))
  }
}

/**
 * Create brand (Admin - multipart/form-data)
 * @param formData - Form data containing brand information and image
 * @returns Promise with created brand data
 * @throws Error with backend message
 */
export const createBrandClientAPI = async (formData: FormData) => {
  try {
    return await kyNextInstance
      .post('admin/brands', { body: formData })
      .json<IApiResponseWrapperType<IAdminBrandDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create brand'))
  }
}

/**
 * Update brand (Admin - multipart/form-data)
 * @param id - Brand ID to update
 * @param formData - Form data containing updated brand information
 * @returns Promise with updated brand data
 * @throws Error with backend message
 */
export const updateBrandClientAPI = async (id: string, formData: FormData) => {
  try {
    return await kyNextInstance
      .patch(`admin/brands/${id}`, { body: formData })
      .json<IApiResponseWrapperType<IAdminBrandDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to update brand'))
  }
}

/**
 * Delete brand (Admin)
 * @param id - Brand ID to delete
 * @returns Promise with deleted brand data
 * @throws Error with backend message
 */
export const deleteBrandClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/brands/${id}`)
      .json<IApiResponseWrapperType<IAdminBrandDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to delete brand'))
  }
}
