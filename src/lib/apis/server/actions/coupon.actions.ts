'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApplyCouponPayload,
  IApplyCouponResponse,
  ICouponResponse,
} from '@/lib/types/interfaces/coupon.interfaces'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/**
 * Validate and calculate discount for a coupon code
 * @param payload - Coupon application payload
 * @returns Coupon application response with discount details
 * @throws Error with backend message if request fails
 */
export const applyCouponAction = async (
  payload: IApplyCouponPayload,
): Promise<IApiResponseWrapperType<IApplyCouponResponse>> =>
  kyInstance
    .post('coupon/apply', { json: payload })
    .json<IApiResponseWrapperType<IApplyCouponResponse>>()

/**
 * Get a single coupon by ID or code
 * @param idOrCode - Coupon ID or code
 * @returns Coupon data
 * @throws Error with backend message if request fails
 */
export const getCouponAction = async (
  idOrCode: string,
): Promise<IApiResponseWrapperType<ICouponResponse>> =>
  kyInstance
    .get(`coupon/${idOrCode}`)
    .json<IApiResponseWrapperType<ICouponResponse>>()
