import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
// import { couponApi } from "@/lib/apis/client/coupon.apis";
import { IApplyCouponPayload } from '@/lib/types/interfaces/coupon.interfaces';
import { applyCouponAPI } from '@/lib/apis/client/coupon.apis';

export const useApplyCouponMutation = () => {
  return useMutation({
    mutationFn: async (payload: IApplyCouponPayload) => {
      const response = await applyCouponAPI(payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Áp dụng mã giảm giá thành công');
    },
    onError: async (error) => {
      try {
        toast.error(
          (error as unknown as string) ||
            'Có lỗi xảy ra khi áp dụng mã giảm giá',
        );
      } catch {
        toast.error('Có lỗi xảy ra khi áp dụng mã giảm giá');
      }
    },
  });
};
