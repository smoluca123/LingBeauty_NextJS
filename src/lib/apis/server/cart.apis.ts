import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  ICartCountType,
  ICartDataType,
} from '@/lib/types/interfaces/cart.interfaces';

/** GET /cart — fetch the current user's full cart */
export const getCartAPI = async (): Promise<
  IApiResponseWrapperType<ICartDataType>
> => kyInstance.get('cart').json<IApiResponseWrapperType<ICartDataType>>();

/** GET /cart/count — fetch lightweight item count for header badge */
export const getCartCountAPI = async (): Promise<
  IApiResponseWrapperType<ICartCountType>
> =>
  kyInstance.get('cart/count').json<IApiResponseWrapperType<ICartCountType>>();
