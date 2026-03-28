import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
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
export const getWishlistClientAPI = async (page = 1, limit = 20) => {
  try {
    return await kyNextInstance
      .get('wishlist', { searchParams: { page, limit } })
      .json<IApiResponseWrapperType<IWishlistResponseType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch wishlist'),
    )
  }
}

/**
 * Add product to wishlist
 * @param data - Add to wishlist payload
 * @returns Promise with created wishlist item
 * @throws Error with backend message
 */
export const addToWishlistClientAPI = async (data: IAddToWishlistDto) => {
  try {
    return await kyNextInstance
      .post('wishlist/items', { json: data })
      .json<IApiResponseWrapperType<IWishlistItemType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to add to wishlist'),
    )
  }
}

/**
 * Update wishlist item note
 * @param itemId - Wishlist item ID
 * @param data - Update payload
 * @returns Promise with updated wishlist item
 * @throws Error with backend message
 */
export const updateWishlistItemClientAPI = async (
  itemId: string,
  data: IUpdateWishlistItemDto,
) => {
  try {
    return await kyNextInstance
      .patch(`wishlist/items/${itemId}`, { json: data })
      .json<IApiResponseWrapperType<IWishlistItemType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update wishlist item'),
    )
  }
}

/**
 * Remove item from wishlist
 * @param itemId - Wishlist item ID
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const removeFromWishlistClientAPI = async (itemId: string) => {
  try {
    return await kyNextInstance
      .delete(`wishlist/items/${itemId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to remove from wishlist'),
    )
  }
}

/**
 * Clear entire wishlist
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const clearWishlistClientAPI = async () => {
  try {
    return await kyNextInstance
      .delete('wishlist')
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to clear wishlist'),
    )
  }
}

/**
 * Move wishlist item to cart
 * @param data - Move to cart payload
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const moveToCartClientAPI = async (data: IMoveToCartDto) => {
  try {
    return await kyNextInstance
      .post('wishlist/move-to-cart', { json: data })
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to move to cart'))
  }
}

/**
 * Create shared wishlist
 * @param data - Create shared wishlist payload
 * @returns Promise with created shared wishlist
 * @throws Error with backend message
 */
export const createSharedWishlistClientAPI = async (
  data: ICreateSharedWishlistDto,
) => {
  try {
    return await kyNextInstance
      .post('wishlist/share', { json: data })
      .json<IApiResponseWrapperType<ISharedWishlistType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create shared wishlist'),
    )
  }
}

/**
 * Get user's shared wishlists
 * @returns Promise with shared wishlists array
 * @throws Error with backend message
 */
export const getMySharedWishlistsClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('wishlist/share')
      .json<IApiResponseWrapperType<ISharedWishlistType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch shared wishlists'),
    )
  }
}

/**
 * Get shared wishlist by token (public access)
 * @param shareToken - Share token
 * @param page - Page number (1-based)
 * @param limit - Number of items per page
 * @returns Promise with shared wishlist detail
 * @throws Error with backend message
 */
export const getSharedWishlistClientAPI = async (
  shareToken: string,
  page = 1,
  limit = 20,
) => {
  try {
    return await kyNextInstance
      .get(`wishlist/shared/${shareToken}`, { searchParams: { page, limit } })
      .json<IApiResponseWrapperType<ISharedWishlistDetailType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch shared wishlist'),
    )
  }
}

/**
 * Delete shared wishlist
 * @param sharedWishlistId - Shared wishlist ID
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteSharedWishlistClientAPI = async (
  sharedWishlistId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`wishlist/share/${sharedWishlistId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete shared wishlist'),
    )
  }
}

/**
 * Check if product is in wishlist
 * @param data - Check wishlist status payload
 * @returns Promise with wishlist status
 * @throws Error with backend message
 */
export const checkWishlistStatusClientAPI = async (
  data: ICheckWishlistStatusDto,
) => {
  try {
    return await kyNextInstance
      .post('wishlist/check-status', { json: data })
      .json<IApiResponseWrapperType<IWishlistStatusResponse>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to check wishlist status'),
    )
  }
}
