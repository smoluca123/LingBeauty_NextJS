import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/api'
import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApplyCouponPayload,
  IApplyCouponResponse,
  ICouponResponse,
} from '@/lib/types/interfaces/coupon.interfaces'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'

/**
 * Validate and calculate discount for a coupon code
 * @param payload - Coupon application payload
 * @returns Coupon application response with discount details
 * @throws Error with backend message if request fails
 */
export const applyCouponAPI = async (
  payload: IApplyCouponPayload,
): Promise<IApiResponseWrapperType<IApplyCouponResponse>> =>
  kyInstance
    .post('coupon/apply', { json: payload })
    .json<IApiResponseWrapperType<IApplyCouponResponse>>()

/**
 * Get paginated list of all coupons (Admin)
 * @param params - Pagination and search parameters
 * @returns Paginated coupon list
 * @throws Error with backend message if request fails
 */
export const getAllCouponsAPI = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  search,
}: {
  page?: number
  limit?: number
  search?: string
} = {}): Promise<IApiPaginationResponseWrapperType<ICouponResponse>> =>
  kyInstance
    .get('coupon', {
      searchParams: { page, limit, ...(search && { search }) },
    })
    .json<IApiPaginationResponseWrapperType<ICouponResponse>>()

/**
 * Get a single coupon by ID or code
 * @param idOrCode - Coupon ID or code
 * @returns Coupon data
 * @throws Error with backend message if request fails
 */
export const getCouponAPI = async (
  idOrCode: string,
): Promise<IApiResponseWrapperType<ICouponResponse>> =>
  kyInstance
    .get(`coupon/${idOrCode}`)
    .json<IApiResponseWrapperType<ICouponResponse>>()
