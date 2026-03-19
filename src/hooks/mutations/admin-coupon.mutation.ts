import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminCouponQueryKeys } from '@/hooks/querys/admin-coupon.query';
import {
  createCouponClientAPI,
  updateCouponClientAPI,
  deleteCouponClientAPI,
} from '@/lib/apis/client/admin-coupon.apis';
import type {
  ICreateCouponFormData,
  IUpdateCouponFormData,
} from '@/lib/types/interfaces/apis/coupon.interfaces';

// ── Create Coupon ────────────────────────────────────────────────────────────

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateCouponFormData) => createCouponClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCouponQueryKeys.coupons,
      });
      toast.success('Tạo mã giảm giá thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo mã giảm giá thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Coupon ────────────────────────────────────────────────────────────

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCouponFormData }) =>
      updateCouponClientAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminCouponQueryKeys.coupons,
      });
      queryClient.invalidateQueries({
        queryKey: adminCouponQueryKeys.coupon(variables.id),
      });
      toast.success('Cập nhật mã giảm giá thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật mã giảm giá thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Coupon ────────────────────────────────────────────────────────────

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCouponClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCouponQueryKeys.coupons,
      });
      toast.success('Xóa mã giảm giá thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa mã giảm giá thất bại. Vui lòng thử lại.',
      );
    },
  });
};
