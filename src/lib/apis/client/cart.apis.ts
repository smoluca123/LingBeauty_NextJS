import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IAddToCartPayload,
  ICartCountType,
  ICartDataType,
  ICartItemType,
  IUpdateCartItemPayload,
} from '@/lib/types/interfaces/cart.interfaces';
import { extractErrorMessage } from '@/lib/utils/utils';

/** GET /api/cart — fetch the current user's full cart */
export const getCartAPI = async (): Promise<
  IApiResponseWrapperType<ICartDataType>
> => {
  try {
    return await kyNextInstance
      .get('cart')
      .json<IApiResponseWrapperType<ICartDataType>>();
  } catch (error) {
    throw await extractErrorMessage(error, 'Lấy giỏ hàng thất bại');
  }
};

/** GET /api/cart/count — lightweight count for header badge */
export const getCartCountAPI = async (): Promise<
  IApiResponseWrapperType<ICartCountType>
> => {
  try {
    return await kyNextInstance
      .get('cart/count')
      .json<IApiResponseWrapperType<ICartCountType>>();
  } catch (error) {
    throw await extractErrorMessage(error, 'Lấy số lượng giỏ hàng thất bại');
  }
};

/** POST /api/cart/items — add a product variant to cart */
export const addToCartAPI = async (
  payload: IAddToCartPayload,
): Promise<IApiResponseWrapperType<ICartItemType>> => {
  try {
    return await kyNextInstance
      .post('cart/items', { json: payload })
      .json<IApiResponseWrapperType<ICartItemType>>();
  } catch (error) {
    throw await extractErrorMessage(error, 'Thêm vào giỏ hàng thất bại');
  }
};

/** PATCH /api/cart/items/:itemId — update quantity of a cart item */
export const updateCartItemAPI = async (
  itemId: string,
  payload: IUpdateCartItemPayload,
): Promise<IApiResponseWrapperType<ICartItemType>> => {
  try {
    return await kyNextInstance
      .patch(`cart/items/${itemId}`, { json: payload })
      .json<IApiResponseWrapperType<ICartItemType>>();
  } catch (error) {
    throw await extractErrorMessage(error, 'Cập nhật giỏ hàng thất bại');
  }
};

/** DELETE /api/cart/items/:itemId — remove a single item from cart */
export const removeCartItemAPI = async (
  itemId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    return await kyNextInstance
      .delete(`cart/items/${itemId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    throw await extractErrorMessage(
      error,
      'Xóa sản phẩm khỏi giỏ hàng thất bại',
    );
  }
};

/** DELETE /api/cart — clear the entire cart */
export const clearCartAPI = async (): Promise<
  IApiResponseWrapperType<{ message: string }>
> => {
  try {
    return await kyNextInstance
      .delete('cart')
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    throw await extractErrorMessage(error, 'Xóa giỏ hàng thất bại');
  }
};
