import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  ICouponDataType,
  ICouponFilterParams,
  ICreateCouponFormData,
  IUpdateCouponFormData,
} from '@/lib/types/interfaces/apis/coupon.interfaces';

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

/**
 * Get all coupons with pagination and filtering
 * Calls: GET /api/admin/coupons
 */
export const getAllCouponsClientAPI = async (params?: ICouponFilterParams) => {
  try {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = String(params.page);
    if (params?.limit) searchParams.limit = String(params.limit);
    if (params?.search) searchParams.search = params.search;
    if (params?.isActive !== undefined)
      searchParams.isActive = String(params.isActive);
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    return await kyNextInstance
      .get('admin/coupons', { searchParams })
      .json<IApiPaginationResponseWrapperType<ICouponDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get coupon by ID
 * Calls: GET /api/admin/coupons/:id
 */
export const getCouponByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/coupons/${id}`)
      .json<IApiResponseWrapperType<ICouponDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create new coupon
 * Calls: POST /api/admin/coupons
 */
export const createCouponClientAPI = async (data: ICreateCouponFormData) => {
  try {
    return await kyNextInstance
      .post('admin/coupons', { json: data })
      .json<IApiResponseWrapperType<ICouponDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update coupon
 * Calls: PATCH /api/admin/coupons/:id
 */
export const updateCouponClientAPI = async (
  id: string,
  data: IUpdateCouponFormData,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/coupons/${id}`, { json: data })
      .json<IApiResponseWrapperType<ICouponDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete coupon
 * Calls: DELETE /api/admin/coupons/:id
 */
export const deleteCouponClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/coupons/${id}`)
      .json<IApiResponseWrapperType<ICouponDataType>>();
  } catch (error) {
    return handleError(error);
  }
};
