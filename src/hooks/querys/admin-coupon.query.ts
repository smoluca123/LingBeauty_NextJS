import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  getAllCouponsClientAPI,
  getCouponByIdClientAPI,
} from '@/lib/apis/client/admin-coupon.apis';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  ICouponDataType,
  ICouponFilterParams,
} from '@/lib/types/interfaces/apis/coupon.interfaces';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminCouponQueryKeys = {
  coupons: ['admin', 'coupons'] as const,
  coupon: (id: string) => ['admin', 'coupon', id] as const,
};

// ── Get All Coupons ──────────────────────────────────────────────────────────

export const useAdminCouponsQuery = (
  params?: ICouponFilterParams,
  options?: Omit<
    UseQueryOptions<IApiPaginationResponseWrapperType<ICouponDataType>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: [...adminCouponQueryKeys.coupons, params],
    queryFn: () => getAllCouponsClientAPI(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });

// ── Get Coupon by ID ─────────────────────────────────────────────────────────

export const useAdminCouponQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<IApiResponseWrapperType<ICouponDataType>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: adminCouponQueryKeys.coupon(id),
    queryFn: () => getCouponByIdClientAPI(id),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!id,
    ...options,
  });
