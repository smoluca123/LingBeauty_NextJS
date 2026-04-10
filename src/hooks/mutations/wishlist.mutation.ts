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
  IWishlistResponseType,
  IWishlistStatusResponse,
  ISharedWishlistType,
} from '@/lib/types/interfaces/apis/wishlist.interfaces'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

// Type for infinite query data
interface IInfiniteWishlistData {
  pages: IApiResponseWrapperType<IWishlistResponseType>[]
  pageParams: number[]
}

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

      // Add to infinite query data
      queryClient.setQueriesData<IInfiniteWishlistData | undefined>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return (
              key[0] === 'wishlist' &&
              key[1] === 'list' &&
              !key.includes('shared')
            )
          },
        },
        (oldData) => {
          if (!oldData?.pages) return oldData

          // Add to first page
          const newPages = [...oldData.pages]
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              data: {
                ...newPages[0].data,
                items: [response.data, ...newPages[0].data.items],
                totalCount: newPages[0].data.totalCount + 1,
              },
            }
          }

          return {
            ...oldData,
            pages: newPages,
          }
        },
      )

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
      const updatedItem = response.data

      // Update infinite query data for wishlist
      queryClient.setQueriesData<IInfiniteWishlistData | undefined>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return (
              key[0] === 'wishlist' &&
              key[1] === 'list' &&
              !key.includes('shared')
            )
          },
        },
        (oldData) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item,
                ),
              },
            })),
          }
        },
      )

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

      return { previousStatus, itemId: variables.itemId }
    },
    onSuccess: (response, variables, context) => {
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

      // Remove item from infinite query data
      queryClient.setQueriesData<IInfiniteWishlistData | undefined>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return (
              key[0] === 'wishlist' &&
              key[1] === 'list' &&
              !key.includes('shared')
            )
          },
        },
        (oldData) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (item) => item.id !== context?.itemId,
                ),
                totalCount: Math.max(0, page.data.totalCount - 1),
              },
            })),
          }
        },
      )

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
      // Clear all wishlist data immediately
      queryClient.setQueriesData<IInfiniteWishlistData | undefined>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return (
              key[0] === 'wishlist' &&
              key[1] === 'list' &&
              !key.includes('shared')
            )
          },
        },
        (oldData) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: [],
                totalCount: 0,
              },
            })),
          }
        },
      )

      // Clear all status queries
      queryClient.setQueriesData<
        IApiResponseWrapperType<IWishlistStatusResponse> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'wishlist' && key[1] === 'status'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              isInWishlist: false,
              wishlistItemId: null,
            },
          }
        },
      )

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
    mutationFn: ({ data }: { data: IMoveToCartDto; itemId: string }) =>
      moveToCartClientAPI(data),
    onSuccess: (response, variables) => {
      // Remove item from wishlist infinite query
      queryClient.setQueriesData<IInfiniteWishlistData | undefined>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return (
              key[0] === 'wishlist' &&
              key[1] === 'list' &&
              !key.includes('shared')
            )
          },
        },
        (oldData) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (item) => item.id !== variables.itemId,
                ),
                totalCount: Math.max(0, page.data.totalCount - 1),
              },
            })),
          }
        },
      )

      // Invalidate cart to refetch with new item
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
    onSuccess: (response, sharedWishlistId) => {
      // Remove from shared list immediately
      queryClient.setQueryData<
        IApiResponseWrapperType<ISharedWishlistType[]> | undefined
      >(wishlistKeys.sharedList(), (oldData) => {
        if (!oldData?.data) return oldData

        return {
          ...oldData,
          data: oldData.data.filter((item) => item.id !== sharedWishlistId),
        }
      })

      toast.success(response.data.message || 'Đã xóa link chia sẻ')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Không thể xóa link chia sẻ',
      )
    },
  })
}
