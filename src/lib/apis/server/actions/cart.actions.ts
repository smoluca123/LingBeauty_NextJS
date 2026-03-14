'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IAddToCartPayload,
  ICartItemType,
  IUpdateCartItemPayload,
} from '@/lib/types/interfaces/cart.interfaces';

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/** POST /cart/items — add a variant to cart */
export const addToCartAction = async (payload: IAddToCartPayload) =>
  kyInstance
    .post('cart/items', { json: payload })
    .json<IApiResponseWrapperType<ICartItemType>>();

/** PATCH /cart/items/:itemId — update quantity of a cart item */
export const updateCartItemAction = async (
  itemId: string,
  payload: IUpdateCartItemPayload,
) =>
  kyInstance
    .patch(`cart/items/${itemId}`, { json: payload })
    .json<IApiResponseWrapperType<ICartItemType>>();

/** DELETE /cart/items/:itemId — remove a single item from cart */
export const removeCartItemAction = async (itemId: string) =>
  kyInstance
    .delete(`cart/items/${itemId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

/** DELETE /cart — clear all items from cart */
export const clearCartAction = async () =>
  kyInstance
    .delete('cart')
    .json<IApiResponseWrapperType<{ message: string }>>();
