import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getWishlistClientAPI,
  getMySharedWishlistsClientAPI,
  getSharedWishlistClientAPI,
  checkWishlistStatusClientAPI,
} from '@/lib/apis/client/wishlist-apis'
import { useAuthUser } from '@/hooks/use-auth'

// Query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  list: () => [...wishlistKeys.all, 'list'] as const,
  shared: () => [...wishlistKeys.all, 'shared'] as const,
  sharedList: () => [...wishlistKeys.shared(), 'list'] as const,
  sharedDetail: (token: string) =>
    [...wishlistKeys.shared(), 'detail', token] as const,
  status: (productId: string, variantId?: string) =>
    [...wishlistKeys.all, 'status', productId, variantId] as const,
}

/**
 * Hook to get user's wishlist with infinite scroll
 */
export const useWishlist = (limit = 20) => {
  const user = useAuthUser()
  return useInfiniteQuery({
    queryKey: [...wishlistKeys.list(), limit],
    queryFn: ({ pageParam = 1 }) => getWishlistClientAPI(pageParam, limit),
    getNextPageParam: (lastPage) => {
      const data = lastPage.data
      return data.hasMore ? data.page + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!user,
  })
}

/**
 * Hook to get user's shared wishlists
 */
export const useMySharedWishlists = () => {
  return useQuery({
    queryKey: wishlistKeys.sharedList(),
    queryFn: getMySharedWishlistsClientAPI,
  })
}

/**
 * Hook to get shared wishlist by token (public) with infinite scroll
 */
export const useSharedWishlist = (shareToken: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: [...wishlistKeys.sharedDetail(shareToken), limit],
    queryFn: ({ pageParam = 1 }) =>
      getSharedWishlistClientAPI(shareToken, pageParam, limit),
    getNextPageParam: (lastPage) => {
      const data = lastPage.data
      return data.hasMore ? data.page + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!shareToken,
  })
}

/**
 * Hook to check if product is in wishlist
 */
export const useWishlistStatus = (productId: string, variantId?: string) => {
  const user = useAuthUser()
  return useQuery({
    queryKey: wishlistKeys.status(productId, variantId),
    queryFn: () => checkWishlistStatusClientAPI({ productId, variantId }),
    enabled: !!productId && !!user,
  })
}
