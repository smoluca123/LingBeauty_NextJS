import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAddToCartPayload,
  ICartCountType,
  ICartDataType,
  ICartItemType,
  IUpdateCartItemPayload,
} from '@/lib/types/interfaces/cart.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Fetch the current user's full cart
 * @returns Promise with cart data
 * @throws Error with backend message
 */
export const getCartAPI = async (): Promise<
  IApiResponseWrapperType<ICartDataType>
> => {
  try {
    return await kyNextInstance
      .get('cart')
      .json<IApiResponseWrapperType<ICartDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Lấy giỏ hàng thất bại'))
  }
}

/**
 * Fetch lightweight cart count for header badge
 * @returns Promise with cart count data
 * @throws Error with backend message
 */
export const getCartCountAPI = async (): Promise<
  IApiResponseWrapperType<ICartCountType>
> => {
  try {
    return await kyNextInstance
      .get('cart/count')
      .json<IApiResponseWrapperType<ICartCountType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Lấy số lượng giỏ hàng thất bại'),
    )
  }
}

/**
 * Add a product variant to cart
 * @param payload - Cart item data to add
 * @returns Promise with added cart item
 * @throws Error with backend message
 */
export const addToCartAPI = async (
  payload: IAddToCartPayload,
): Promise<IApiResponseWrapperType<ICartItemType>> => {
  try {
    return await kyNextInstance
      .post('cart/items', { json: payload })
      .json<IApiResponseWrapperType<ICartItemType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Thêm vào giỏ hàng thất bại'),
    )
  }
}

/**
 * Update quantity of a cart item
 * @param itemId - Cart item ID to update
 * @param payload - Updated cart item data
 * @returns Promise with updated cart item
 * @throws Error with backend message
 */
export const updateCartItemAPI = async (
  itemId: string,
  payload: IUpdateCartItemPayload,
): Promise<IApiResponseWrapperType<ICartItemType>> => {
  try {
    return await kyNextInstance
      .patch(`cart/items/${itemId}`, { json: payload })
      .json<IApiResponseWrapperType<ICartItemType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Cập nhật giỏ hàng thất bại'),
    )
  }
}

/**
 * Remove a single item from cart
 * @param itemId - Cart item ID to remove
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const removeCartItemAPI = async (
  itemId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    return await kyNextInstance
      .delete(`cart/items/${itemId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Xóa sản phẩm khỏi giỏ hàng thất bại'),
    )
  }
}

/**
 * Clear the entire cart
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const clearCartAPI = async (): Promise<
  IApiResponseWrapperType<{ message: string }>
> => {
  try {
    return await kyNextInstance
      .delete('cart')
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Xóa giỏ hàng thất bại'))
  }
}
