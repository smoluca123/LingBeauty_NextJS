'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IWishlistResponseType,
  IWishlistItemType,
  ISharedWishlistType,
  ISharedWishlistDetailType,
  IAddToWishlistDto,
  IUpdateWishlistItemDto,
  ICreateSharedWishlistDto,
  IMoveToCartDto,
  ICheckWishlistStatusDto,
  IWishlistStatusResponse,
} from '@/lib/types/interfaces/apis/wishlist.interfaces'

/**
 * Get user's wishlist
 * @param page - Page number (1-based)
 * @param limit - Number of items per page
 * @returns Promise with wishlist data
 * @throws Error with backend message
 */
export const getWishlistAPI = async (page = 1, limit = 20) => {
  return kyInstance
    .get('wishlist', { searchParams: { page, limit } })
    .json<IApiResponseWrapperType<IWishlistResponseType>>()
}

/**
 * Add product to wishlist
 * @param data - Add to wishlist payload
 * @returns Promise with created wishlist item
 * @throws Error with backend message
 */
export const addToWishlistAPI = async (data: IAddToWishlistDto) => {
  return kyInstance
    .post('wishlist/items', { json: data })
    .json<IApiResponseWrapperType<IWishlistItemType>>()
}

/**
 * Update wishlist item note
 * @param itemId - Wishlist item ID
 * @param data - Update payload
 * @returns Promise with updated wishlist item
 * @throws Error with backend message
 */
export const updateWishlistItemAPI = async (
  itemId: string,
  data: IUpdateWishlistItemDto,
) => {
  return kyInstance
    .patch(`wishlist/items/${itemId}`, { json: data })
    .json<IApiResponseWrapperType<IWishlistItemType>>()
}

/**
 * Remove item from wishlist
 * @param itemId - Wishlist item ID
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const removeFromWishlistAPI = async (itemId: string) => {
  return kyInstance
    .delete(`wishlist/items/${itemId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()
}

/**
 * Clear entire wishlist
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const clearWishlistAPI = async () => {
  return kyInstance
    .delete('wishlist')
    .json<IApiResponseWrapperType<{ message: string }>>()
}

/**
 * Move wishlist item to cart
 * @param data - Move to cart payload
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const moveToCartAPI = async (data: IMoveToCartDto) => {
  return kyInstance
    .post('wishlist/move-to-cart', { json: data })
    .json<IApiResponseWrapperType<{ message: string }>>()
}

/**
 * Create shared wishlist
 * @param data - Create shared wishlist payload
 * @returns Promise with created shared wishlist
 * @throws Error with backend message
 */
export const createSharedWishlistAPI = async (
  data: ICreateSharedWishlistDto,
) => {
  return kyInstance
    .post('wishlist/share', { json: data })
    .json<IApiResponseWrapperType<ISharedWishlistType>>()
}

/**
 * Get user's shared wishlists
 * @returns Promise with shared wishlists array
 * @throws Error with backend message
 */
export const getMySharedWishlistsAPI = async () => {
  return kyInstance
    .get('wishlist/share')
    .json<IApiResponseWrapperType<ISharedWishlistType[]>>()
}

/**
 * Get shared wishlist by token (public access)
 * @param shareToken - Share token
 * @param page - Page number (1-based)
 * @param limit - Number of items per page
 * @returns Promise with shared wishlist detail
 * @throws Error with backend message
 */
export const getSharedWishlistAPI = async (
  shareToken: string,
  page = 1,
  limit = 20,
) => {
  return kyInstance
    .get(`wishlist/shared/${shareToken}`, { searchParams: { page, limit } })
    .json<IApiResponseWrapperType<ISharedWishlistDetailType>>()
}

/**
 * Delete shared wishlist
 * @param sharedWishlistId - Shared wishlist ID
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteSharedWishlistAPI = async (sharedWishlistId: string) => {
  return kyInstance
    .delete(`wishlist/share/${sharedWishlistId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()
}

/**
 * Check if product is in wishlist
 * @param data - Check wishlist status payload
 * @returns Promise with wishlist status
 * @throws Error with backend message
 */
export const checkWishlistStatusAPI = async (data: ICheckWishlistStatusDto) => {
  return kyInstance
    .post('wishlist/check-status', { json: data })
    .json<IApiResponseWrapperType<IWishlistStatusResponse>>()
}
