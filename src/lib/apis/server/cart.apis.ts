import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  ICartCountType,
  ICartDataType,
} from '@/lib/types/interfaces/cart.interfaces'

/**
 * Get current user's full cart
 * @returns Cart data with items
 * @throws Error with backend message if request fails
 */
export const getCartAPI = async (): Promise<
  IApiResponseWrapperType<ICartDataType>
> => kyInstance.get('cart').json<IApiResponseWrapperType<ICartDataType>>()

/**
 * Get lightweight cart item count for header badge
 * @returns Cart count data
 * @throws Error with backend message if request fails
 */
export const getCartCountAPI = async (): Promise<
  IApiResponseWrapperType<ICartCountType>
> =>
  kyInstance.get('cart/count').json<IApiResponseWrapperType<ICartCountType>>()
