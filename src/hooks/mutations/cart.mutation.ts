'use client';

import {
  addToCartAPI,
  clearCartAPI,
  removeCartItemAPI,
  updateCartItemAPI,
} from '@/lib/apis/client/cart.apis';
import { queryClient } from '@/lib/query-client/query-client';
import type {
  IAddToCartPayload,
  IUpdateCartItemPayload,
} from '@/lib/types/interfaces/cart.interfaces';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartQueryKeys } from '@/hooks/querys/cart.query';

/** Invalidate all cart-related queries to refetch fresh data */
const invalidateCartQueries = async () => {
  await queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
};

/** Add a product variant to the cart */
export const useAddToCartMutation = () => {
  return useMutation({
    mutationFn: (payload: IAddToCartPayload) => addToCartAPI(payload),
    onSuccess: async (data) => {
      await invalidateCartQueries();
      toast.success(data.message || 'Đã thêm vào giỏ hàng');
    },
    onError: (error: string) => {
      console.log(error);
      toast.error(error || 'Thêm vào giỏ hàng thất bại');
    },
  });
};

/** Update quantity of a specific cart item */
export const useUpdateCartItemMutation = () => {
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: IUpdateCartItemPayload;
    }) => updateCartItemAPI(itemId, payload),
    onSuccess: async () => {
      await invalidateCartQueries();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật giỏ hàng thất bại');
    },
  });
};

/** Remove a single item from the cart */
export const useRemoveCartItemMutation = () => {
  return useMutation({
    mutationFn: (itemId: string) => removeCartItemAPI(itemId),
    onSuccess: async (data) => {
      await invalidateCartQueries();
      toast.success(data.message || 'Đã xóa sản phẩm khỏi giỏ hàng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa sản phẩm khỏi giỏ hàng thất bại');
    },
  });
};

/** Clear all items from the cart */
export const useClearCartMutation = () => {
  return useMutation({
    mutationFn: () => clearCartAPI(),
    onSuccess: async (data) => {
      await invalidateCartQueries();
      toast.success(data.message || 'Đã xóa toàn bộ giỏ hàng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa giỏ hàng thất bại');
    },
  });
};
