import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import type {
  IApplyCouponPayload,
  IApplyCouponResponse,
  ICouponResponse,
} from '@/lib/types/interfaces/coupon.interfaces';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { extractErrorMessage } from '@/lib/utils';

/** POST /api/coupon/apply — validate and calculate discount for a coupon code */
export const applyCouponAPI = async (
  payload: IApplyCouponPayload,
): Promise<IApiResponseWrapperType<IApplyCouponResponse>> => {
  try {
    return await kyNextInstance
      .post('coupon/apply', { json: payload })
      .json<IApiResponseWrapperType<IApplyCouponResponse>>();
  } catch (error) {
    throw await extractErrorMessage(error, 'Áp dụng mã giảm giá thất bại');
  }
};

/** GET /api/coupon — fetch paginated list of all coupons (admin) */
export const getAllCouponsAPI = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<IApiPaginationResponseWrapperType<ICouponResponse>> => {
  try {
    return await kyNextInstance
      .get('coupon', { searchParams: params })
      .json<IApiPaginationResponseWrapperType<ICouponResponse>>();
  } catch (error) {
    throw await extractErrorMessage(
      error,
      'Lấy danh sách mã giảm giá thất bại',
    );
  }
};
