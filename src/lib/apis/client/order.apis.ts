import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IOrderDataType,
  IOrderListItemDataType,
  ICreateOrderPayload,
  ICancelOrderPayload,
  IGetMyOrdersParams,
} from '@/lib/types/interfaces/apis/order.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

export const createOrderClientAPI = async (
  payload: ICreateOrderPayload,
): Promise<IApiResponseWrapperType<IOrderDataType>> => {
  try {
    return await kyNextInstance
      .post('order', { json: payload })
      .json<IApiResponseWrapperType<IOrderDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Đặt hàng thất bại'))
  }
}

export const getMyOrdersClientAPI = async (
  params: IGetMyOrdersParams = {},
): Promise<IApiPaginationResponseWrapperType<IOrderListItemDataType>> => {
  try {
    // Filter out undefined values so ky doesn't append empty params
    const searchParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null),
    ) as Record<string, string | number>

    return await kyNextInstance
      .get('order/my-orders', { searchParams })
      .json<IApiPaginationResponseWrapperType<IOrderListItemDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Lấy danh sách đơn hàng thất bại'),
    )
  }
}

export const getOrderByIdClientAPI = async (
  orderId: string,
): Promise<IApiResponseWrapperType<IOrderDataType>> => {
  try {
    return await kyNextInstance
      .get(`order/${orderId}`)
      .json<IApiResponseWrapperType<IOrderDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Lấy thông tin đơn hàng thất bại'),
    )
  }
}

// POST /order/:id/cancel — backend uses POST for cancel action
export const cancelOrderClientAPI = async (
  orderId: string,
  payload: ICancelOrderPayload,
): Promise<IApiResponseWrapperType<IOrderDataType>> => {
  try {
    return await kyNextInstance
      .post(`order/${orderId}/cancel`, { json: payload })
      .json<IApiResponseWrapperType<IOrderDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Hủy đơn hàng thất bại'))
  }
}
