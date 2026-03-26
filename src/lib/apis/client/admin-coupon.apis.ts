import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  ICouponDataType,
  ICouponFilterParams,
  ICreateCouponFormData,
  IUpdateCouponFormData,
} from '@/lib/types/interfaces/apis/coupon.interfaces'

/**
 * Get all coupons with pagination and filtering
 * Calls: GET /api/admin/coupons
 * @param params - Filter parameters
 * @returns Promise with paginated coupon data
 * @throws Error with backend message
 */
export const getAllCouponsClientAPI = async (params?: ICouponFilterParams) => {
  try {
    const searchParams: Record<string, string> = {}
    if (params?.page) searchParams.page = String(params.page)
    if (params?.limit) searchParams.limit = String(params.limit)
    if (params?.search) searchParams.search = params.search
    if (params?.isActive !== undefined)
      searchParams.isActive = String(params.isActive)
    if (params?.sortBy) searchParams.sortBy = params.sortBy
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder

    return await kyNextInstance
      .get('admin/coupons', { searchParams })
      .json<IApiPaginationResponseWrapperType<ICouponDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch coupons'))
  }
}

/**
 * Get coupon by ID
 * Calls: GET /api/admin/coupons/:id
 * @param id - Coupon ID
 * @returns Promise with coupon data
 * @throws Error with backend message
 */
export const getCouponByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/coupons/${id}`)
      .json<IApiResponseWrapperType<ICouponDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch coupon'))
  }
}

/**
 * Create new coupon
 * Calls: POST /api/admin/coupons
 * @param data - Coupon creation data
 * @returns Promise with created coupon data
 * @throws Error with backend message
 */
export const createCouponClientAPI = async (data: ICreateCouponFormData) => {
  try {
    return await kyNextInstance
      .post('admin/coupons', { json: data })
      .json<IApiResponseWrapperType<ICouponDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create coupon'))
  }
}

/**
 * Update coupon
 * Calls: PATCH /api/admin/coupons/:id
 * @param id - Coupon ID to update
 * @param data - Coupon update data
 * @returns Promise with updated coupon data
 * @throws Error with backend message
 */
export const updateCouponClientAPI = async (
  id: string,
  data: IUpdateCouponFormData,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/coupons/${id}`, { json: data })
      .json<IApiResponseWrapperType<ICouponDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to update coupon'))
  }
}

/**
 * Delete coupon
 * Calls: DELETE /api/admin/coupons/:id
 * @param id - Coupon ID to delete
 * @returns Promise with deleted coupon data
 * @throws Error with backend message
 */
export const deleteCouponClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/coupons/${id}`)
      .json<IApiResponseWrapperType<ICouponDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to delete coupon'))
  }
}
