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
  ICartCountType,
  ICartDataType,
  IUpdateCartItemPayload,
} from '@/lib/types/interfaces/cart.interfaces';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartQueryKeys } from '@/hooks/querys/cart.query';

/** Invalidate all cart-related queries to refetch fresh data */
const invalidateCartQueries = () => {
  queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
};

/** Add a product variant to the cart */
export const useAddToCartMutation = () => {
  return useMutation({
    mutationFn: (payload: IAddToCartPayload) => addToCartAPI(payload),
    onSuccess: (data, variables) => {
      const addedItem = data.data;
      
      // Get the current cart detail cache
      const oldDetail = queryClient.getQueryData<
        IApiResponseWrapperType<ICartDataType>
      >(cartQueryKeys.detail());

      if (oldDetail?.data) {
        const cart = oldDetail.data;
        
        // Find if the item already exists in the cart to update quantity or add new
        const existingItemIndex = cart.items.findIndex(
          (item) => item.id === addedItem.id,
        );

        let isNewItem = true;
        const newItems = [...cart.items];
        
        // Calculate the difference in quantity and price to update the cart summary safely
        let qtyDiff = variables.quantity || 1;
        let priceDiff = Number(addedItem.lineTotal);

        if (existingItemIndex > -1) {
          isNewItem = false;
          const oldItem = cart.items[existingItemIndex];
          
          // If the item exists, we calculate the difference between the new quantity and the old quantity
          qtyDiff = addedItem.quantity - oldItem.quantity;
          priceDiff = Number(addedItem.lineTotal) - Number(oldItem.lineTotal);
          
          // Replace the old item with the new updated item
          newItems[existingItemIndex] = addedItem;
        } else {
          // If the item is new, add it to the list
          newItems.push(addedItem);
          qtyDiff = addedItem.quantity;
        }

        // Update the cart detail cache
        queryClient.setQueryData(
          cartQueryKeys.detail(),
          (old: IApiResponseWrapperType<ICartDataType> | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                ...old.data,
                items: newItems,
                summary: {
                  ...old.data.summary,
                  itemCount: newItems.length,
                  totalQuantity: old.data.summary.totalQuantity + qtyDiff,
                  subtotal: (
                    Number(old.data.summary.subtotal) + priceDiff
                  ).toString(),
                },
              },
            };
          },
        );

        // Update the cart count badge cache
        queryClient.setQueryData(
          cartQueryKeys.count(),
          (old: IApiResponseWrapperType<ICartCountType> | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                itemCount: isNewItem
                  ? old.data.itemCount + 1
                  : old.data.itemCount,
                totalQuantity: old.data.totalQuantity + qtyDiff,
              },
            };
          },
        );
      } else {
        // Fallback to invalidate if the detail cache is missing
        invalidateCartQueries();
      }

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
    onSuccess: (data, variables) => {
      const updatedItem = data.data;

      // Update the cart detail cache directly
      queryClient.setQueryData(
        cartQueryKeys.detail(),
        (old: IApiResponseWrapperType<ICartDataType> | undefined) => {
          // Fallback if cache is missing
          if (!old?.data) {
            invalidateCartQueries();
            return old;
          }

          const cart = old.data;
          
          // Find the item being updated
          const existingItemIndex = cart.items.findIndex(
            (item) => item.id === variables.itemId,
          );

          // Fallback if item is not found in cache (rare case)
          if (existingItemIndex === -1) {
            invalidateCartQueries();
            return old;
          }

          const oldItem = cart.items[existingItemIndex];
          
          // Calculate differences to adjust the cart summary accurately
          const qtyDiff = updatedItem.quantity - oldItem.quantity;
          const priceDiff =
            Number(updatedItem.lineTotal) - Number(oldItem.lineTotal);

          const newItems = [...cart.items];
          newItems[existingItemIndex] = updatedItem;

          // Sync the cart count badge
          queryClient.setQueryData(
            cartQueryKeys.count(),
            (oldCount: IApiResponseWrapperType<ICartCountType> | undefined) => {
              if (!oldCount?.data) return oldCount;
              return {
                ...oldCount,
                data: {
                  ...oldCount.data,
                  // itemCount remains the same since we only updated the quantity of an existing item
                  totalQuantity: oldCount.data.totalQuantity + qtyDiff,
                },
              };
            },
          );

          // Return the updated overview
          return {
            ...old,
            data: {
              ...cart,
              items: newItems,
              summary: {
                ...cart.summary,
                totalQuantity: cart.summary.totalQuantity + qtyDiff,
                subtotal: (
                  Number(cart.summary.subtotal) + priceDiff
                ).toString(),
              },
            },
          };
        },
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật giỏ hàng thất bại');
      // If mutation fails, invalidate to restore the correct server data
      invalidateCartQueries();
    },
  });
};

/** Remove a single item from the cart */
export const useRemoveCartItemMutation = () => {
  return useMutation({
    mutationFn: (itemId: string) => removeCartItemAPI(itemId),
    onSuccess: (data, itemId) => {
      // Remove item from the cart detail cache directly
      queryClient.setQueryData(
        cartQueryKeys.detail(),
        (old: IApiResponseWrapperType<ICartDataType> | undefined) => {
          if (!old?.data) {
            invalidateCartQueries();
            return old;
          }

          const cart = old.data;
          const existingItemIndex = cart.items.findIndex(
            (item) => item.id === itemId,
          );

          // If the item doesn't exist in the cache, invalidate to refetch
          if (existingItemIndex === -1) {
            invalidateCartQueries();
            return old;
          }

          const removedItem = cart.items[existingItemIndex];
          
          // Calculate negative differences to subtract from the total summary
          const qtyDiff = -removedItem.quantity;
          const priceDiff = -Number(removedItem.lineTotal);

          // Filter out the removed item
          const newItems = cart.items.filter((item) => item.id !== itemId);

          // Sync the cart count badge
          queryClient.setQueryData(
            cartQueryKeys.count(),
            (oldCount: IApiResponseWrapperType<ICartCountType> | undefined) => {
              if (!oldCount?.data) return oldCount;
              return {
                ...oldCount,
                data: {
                  // Math.max avoids negative quantities in edge cases
                  itemCount: Math.max(0, oldCount.data.itemCount - 1),
                  totalQuantity: Math.max(
                    0,
                    oldCount.data.totalQuantity + qtyDiff,
                  ),
                },
              };
            },
          );

          return {
            ...old,
            data: {
              ...cart,
              items: newItems,
              summary: {
                ...cart.summary,
                itemCount: newItems.length,
                totalQuantity: Math.max(
                  0,
                  cart.summary.totalQuantity + qtyDiff,
                ),
                subtotal: Math.max(
                  0,
                  Number(cart.summary.subtotal) + priceDiff,
                ).toString(),
              },
            },
          };
        },
      );

      toast.success(data.message || 'Đã xóa sản phẩm khỏi giỏ hàng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa sản phẩm khỏi giỏ hàng thất bại');
      invalidateCartQueries();
    },
  });
};

/** Clear all items from the cart */
export const useClearCartMutation = () => {
  return useMutation({
    mutationFn: () => clearCartAPI(),
    onSuccess: (data) => {
      // Clear the detail cache
      queryClient.setQueryData(
        cartQueryKeys.detail(),
        (old: IApiResponseWrapperType<ICartDataType> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: [],
              summary: {
                itemCount: 0,
                totalQuantity: 0,
                subtotal: '0',
              },
            },
          };
        },
      );

      // Clear the cart count badge cache
      queryClient.setQueryData(
        cartQueryKeys.count(),
        (old: IApiResponseWrapperType<ICartCountType> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              itemCount: 0,
              totalQuantity: 0,
            },
          };
        },
      );

      toast.success(data.message || 'Đã xóa toàn bộ giỏ hàng');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa giỏ hàng thất bại');
      invalidateCartQueries();
    },
  });
};
