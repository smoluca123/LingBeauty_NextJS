'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces'
import type {
  IApiPaginationResponseWrapperType,
  IApiPaginationParams,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces'

// Helper: remove undefined values before passing to searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Get all categories (Admin only)
 * @returns Array of category data
 * @throws Error with backend message if request fails
 */
export const getAllAdminCategoriesAPI = async () =>
  kyInstance
    .get('category')
    .json<IApiResponseWrapperType<ICategoryDataType[]>>()

/**
 * Get all brands (Admin only)
 * @param params - Pagination and filter parameters
 * @returns Paginated brand list
 * @throws Error with backend message if request fails
 */
export const getAllAdminBrandsAPI = async (
  params: IApiPaginationParams & {
    search?: string
    order?: 'asc' | 'desc'
  } = {},
) =>
  kyInstance
    .get('brand', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        search: params.search,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>()

/**
 * Create brand (Admin only)
 * @param formData - Form data with brand details and image
 * @returns Created brand data
 * @throws Error with backend message if request fails
 */
export const createBrandAPI = async (formData: FormData) =>
  kyInstance
    .post('brand', {
      body: formData,
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>()

/**
 * Update brand (Admin only)
 * @param id - Brand ID to update
 * @param formData - Form data with updated brand details and image
 * @returns Updated brand data
 * @throws Error with backend message if request fails
 */
export const updateBrandAPI = async (id: string, formData: FormData) =>
  kyInstance
    .patch(`brand/${id}`, {
      body: formData,
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>()

/**
 * Delete brand (Admin only)
 * @param id - Brand ID to delete
 * @returns Deleted brand data
 * @throws Error with backend message if request fails
 */
export const deleteBrandAPI = async (id: string) =>
  kyInstance
    .delete(`brand/${id}`)
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>()

/**
 * Create category (Admin only)
 * @param formData - Form data with category details and image
 * @returns Created category data
 * @throws Error with backend message if request fails
 */
export const createCategoryAPI = async (formData: FormData) =>
  kyInstance
    .post('category', {
      body: formData,
    })
    .json<IApiResponseWrapperType<ICategoryDataType>>()

/**
 * Create sub-category (Admin only)
 * @param parentId - Parent category ID
 * @param formData - Form data with sub-category details and image
 * @returns Created sub-category data
 * @throws Error with backend message if request fails
 */
export const createSubCategoryAPI = async (
  parentId: string,
  formData: FormData,
) =>
  kyInstance
    .post(`category/${parentId}/sub-category`, {
      body: formData,
    })
    .json<IApiResponseWrapperType<ICategoryDataType>>()

/**
 * Update category (Admin only)
 * @param id - Category ID to update
 * @param formData - Form data with updated category details and image
 * @returns Updated category data
 * @throws Error with backend message if request fails
 */
export const updateCategoryAPI = async (id: string, formData: FormData) =>
  kyInstance
    .patch(`category/${id}`, {
      body: formData,
    })
    .json<IApiResponseWrapperType<ICategoryDataType>>()

/**
 * Delete category (Admin only)
 * @param id - Category ID to delete
 * @returns Success response
 * @throws Error with backend message if request fails
 */
export const deleteCategoryAPI = async (id: string) =>
  kyInstance.delete(`category/${id}`).json<IApiResponseWrapperType<null>>()
