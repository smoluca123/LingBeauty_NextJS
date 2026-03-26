'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAddToCartPayload,
  ICartItemType,
  IUpdateCartItemPayload,
} from '@/lib/types/interfaces/cart.interfaces'

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/**
 * Add a variant to cart
 * @param payload - Add to cart payload
 * @returns Created cart item
 * @throws Error with backend message if request fails
 */
export const addToCartAction = async (payload: IAddToCartPayload) =>
  kyInstance
    .post('cart/items', { json: payload })
    .json<IApiResponseWrapperType<ICartItemType>>()

/**
 * Update quantity of a cart item
 * @param itemId - Cart item ID to update
 * @param payload - Update payload with new quantity
 * @returns Updated cart item
 * @throws Error with backend message if request fails
 */
export const updateCartItemAction = async (
  itemId: string,
  payload: IUpdateCartItemPayload,
) =>
  kyInstance
    .patch(`cart/items/${itemId}`, { json: payload })
    .json<IApiResponseWrapperType<ICartItemType>>()

/**
 * Remove a single item from cart
 * @param itemId - Cart item ID to remove
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const removeCartItemAction = async (itemId: string) =>
  kyInstance
    .delete(`cart/items/${itemId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Clear all items from cart
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const clearCartAction = async () =>
  kyInstance.delete('cart').json<IApiResponseWrapperType<{ message: string }>>()
