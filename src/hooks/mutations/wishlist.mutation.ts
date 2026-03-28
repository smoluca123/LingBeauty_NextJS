import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  addToWishlistClientAPI,
  updateWishlistItemClientAPI,
  removeFromWishlistClientAPI,
  clearWishlistClientAPI,
  moveToCartClientAPI,
  createSharedWishlistClientAPI,
  deleteSharedWishlistClientAPI,
} from '@/lib/apis/client/wishlist-apis'
import { wishlistKeys } from '@/hooks/querys/wishlist.query'
import type {
  IAddToWishlistDto,
  IUpdateWishlistItemDto,
  ICreateSharedWishlistDto,
  IMoveToCartDto,
} from '@/lib/types/interfaces/apis/wishlist.interfaces'

/**
 * Hook to add product to wishlist with optimistic updates
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IAddToWishlistDto) => addToWishlistClientAPI(data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: wishlistKeys.status(variables.productId, variables.variantId),
      })

      // Snapshot previous value
      const previousStatus = queryClient.getQueryData(
        wishlistKeys.status(variables.productId, variables.variantId),
      )

      // Optimistically update to the new value
      queryClient.setQueryData(
        wishlistKeys.status(variables.productId, variables.variantId),
        {
          data: {
            isInWishlist: true,
            wishlistItemId: 'temp-id', // Temporary ID until server responds
          },
        },
      )

      return { previousStatus }
    },
    onSuccess: (response, variables) => {
      // Update with real data from server
      queryClient.setQueryData(
        wishlistKeys.status(variables.productId, variables.variantId),
        {
          data: {
            isInWishlist: true,
            wishlistItemId: response.data.id,
          },
        },
      )
      // Invalidate list to refresh counts
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() })
      toast.success(response.message || 'Đã thêm vào danh sách yêu thích')
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousStatus) {
        queryClient.setQueryData(
          wishlistKeys.status(variables.productId, variables.variantId),
          context.previousStatus,
        )
      }
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể thêm vào danh sách yêu thích',
      )
    },
  })
}

/**
 * Hook to update wishlist item note
 */
export const useUpdateWishlistItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string
      data: IUpdateWishlistItemDto
    }) => updateWishlistItemClientAPI(itemId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all })
      toast.success(response.message || 'Đã cập nhật ghi chú')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Không thể cập nhật ghi chú',
      )
    },
  })
}

/**
 * Hook to remove item from wishlist with optimistic updates
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
    }: {
      itemId: string
      productId: string
      variantId?: string
    }) => removeFromWishlistClientAPI(itemId),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: wishlistKeys.status(variables.productId, variables.variantId),
      })

      // Snapshot previous value
      const previousStatus = queryClient.getQueryData(
        wishlistKeys.status(variables.productId, variables.variantId),
      )

      // Optimistically update to the new value
      queryClient.setQueryData(
        wishlistKeys.status(variables.productId, variables.variantId),
        {
          data: {
            isInWishlist: false,
            wishlistItemId: null,
          },
        },
      )

      return { previousStatus }
    },
    onSuccess: (response, variables) => {
      // Confirm the optimistic update
      queryClient.setQueryData(
        wishlistKeys.status(variables.productId, variables.variantId),
        {
          data: {
            isInWishlist: false,
            wishlistItemId: null,
          },
        },
      )
      // Invalidate list to refresh counts
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() })
      toast.success(response.data.message || 'Đã xóa khỏi danh sách yêu thích')
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousStatus) {
        queryClient.setQueryData(
          wishlistKeys.status(variables.productId, variables.variantId),
          context.previousStatus,
        )
      }
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể xóa khỏi danh sách yêu thích',
      )
    },
  })
}

/**
 * Hook to clear entire wishlist
 */
export const useClearWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearWishlistClientAPI,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all })
      toast.success(
        response.data.message || 'Đã xóa toàn bộ danh sách yêu thích',
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể xóa danh sách yêu thích',
      )
    },
  })
}

/**
 * Hook to move wishlist item to cart
 */
export const useMoveToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IMoveToCartDto) => moveToCartClientAPI(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success(response.data.message || 'Đã chuyển vào giỏ hàng')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể chuyển vào giỏ hàng',
      )
    },
  })
}

/**
 * Hook to create shared wishlist
 */
export const useCreateSharedWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateSharedWishlistDto) =>
      createSharedWishlistClientAPI(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.sharedList() })
      toast.success(response.message || 'Đã tạo link chia sẻ')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Không thể tạo link chia sẻ',
      )
    },
  })
}

/**
 * Hook to delete shared wishlist
 */
export const useDeleteSharedWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sharedWishlistId: string) =>
      deleteSharedWishlistClientAPI(sharedWishlistId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.sharedList() })
      toast.success(response.data.message || 'Đã xóa link chia sẻ')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Không thể xóa link chia sẻ',
      )
    },
  })
}
