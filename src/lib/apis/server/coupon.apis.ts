import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/api';
import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApplyCouponPayload,
  IApplyCouponResponse,
  ICouponResponse,
} from '@/lib/types/interfaces/coupon.interfaces';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';

/** POST /coupon/apply — validate and calculate discount for a coupon code */
export const applyCouponAPI = async (
  payload: IApplyCouponPayload,
): Promise<IApiResponseWrapperType<IApplyCouponResponse>> =>
  kyInstance
    .post('coupon/apply', { json: payload })
    .json<IApiResponseWrapperType<IApplyCouponResponse>>();

/** GET /coupon — fetch paginated list of all coupons (admin) */
export const getAllCouponsAPI = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<IApiPaginationResponseWrapperType<ICouponResponse>> =>
  kyInstance
    .get('coupon', {
      searchParams: { page, limit, ...(search && { search }) },
    })
    .json<IApiPaginationResponseWrapperType<ICouponResponse>>();

/** GET /coupon/:idOrCode — fetch a single coupon by id or code */
export const getCouponAPI = async (
  idOrCode: string,
): Promise<IApiResponseWrapperType<ICouponResponse>> =>
  kyInstance
    .get(`coupon/${idOrCode}`)
    .json<IApiResponseWrapperType<ICouponResponse>>();
