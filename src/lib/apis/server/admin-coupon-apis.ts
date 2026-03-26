'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  ICouponDataType,
  ICouponFilterParams,
  ICreateCouponFormData,
  IUpdateCouponFormData,
} from '@/lib/types/interfaces/apis/coupon.interfaces'

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Get all coupons with pagination and filtering (Admin - requires JWT auth)
 * @param params - Filter and pagination parameters
 * @returns Paginated coupon list
 * @throws Error with backend message if request fails
 */
export const getAllCouponsAPI = async (params: ICouponFilterParams = {}) =>
  kyInstance
    .get('coupon', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }),
    })
    .json<IApiPaginationResponseWrapperType<ICouponDataType>>()

/**
 * Get coupon by ID (Admin - requires JWT auth)
 * @param id - Coupon ID
 * @returns Coupon data
 * @throws Error with backend message if request fails
 */
export const getCouponByIdAPI = async (id: string) =>
  kyInstance
    .get(`coupon/${id}`)
    .json<IApiResponseWrapperType<ICouponDataType>>()

/**
 * Create new coupon (Admin - requires JWT auth)
 * @param data - Coupon data to create
 * @returns Created coupon data
 * @throws Error with backend message if request fails
 */
export const createCouponAPI = async (data: ICreateCouponFormData) =>
  kyInstance
    .post('coupon', { json: data })
    .json<IApiResponseWrapperType<ICouponDataType>>()

/**
 * Update coupon (Admin - requires JWT auth)
 * @param id - Coupon ID to update
 * @param data - Coupon data to update
 * @returns Updated coupon data
 * @throws Error with backend message if request fails
 */
export const updateCouponAPI = async (
  id: string,
  data: IUpdateCouponFormData,
) =>
  kyInstance
    .patch(`coupon/${id}`, { json: data })
    .json<IApiResponseWrapperType<ICouponDataType>>()

/**
 * Delete coupon (Admin - requires JWT auth)
 * @param id - Coupon ID to delete
 * @returns Deleted coupon data
 * @throws Error with backend message if request fails
 */
export const deleteCouponAPI = async (id: string) =>
  kyInstance
    .delete(`coupon/${id}`)
    .json<IApiResponseWrapperType<ICouponDataType>>()
