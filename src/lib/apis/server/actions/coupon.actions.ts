'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApplyCouponPayload,
  IApplyCouponResponse,
  ICouponResponse,
} from '@/lib/types/interfaces/coupon.interfaces';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/** POST /coupon/apply — validate and calculate discount for a coupon code */
export const applyCouponAction = async (
  payload: IApplyCouponPayload,
): Promise<IApiResponseWrapperType<IApplyCouponResponse>> =>
  kyInstance
    .post('coupon/apply', { json: payload })
    .json<IApiResponseWrapperType<IApplyCouponResponse>>();

/** GET /coupon/:idOrCode — fetch a single coupon by id or code */
export const getCouponAction = async (
  idOrCode: string,
): Promise<IApiResponseWrapperType<ICouponResponse>> =>
  kyInstance
    .get(`coupon/${idOrCode}`)
    .json<IApiResponseWrapperType<ICouponResponse>>();
