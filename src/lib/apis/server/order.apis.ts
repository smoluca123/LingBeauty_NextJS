'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
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

export const createOrderAPI = async (
  payload: ICreateOrderPayload,
): Promise<IApiResponseWrapperType<IOrderDataType>> =>
  kyInstance
    .post('order', { json: payload })
    .json<IApiResponseWrapperType<IOrderDataType>>()

export const getMyOrdersAPI = async (
  params: IGetMyOrdersParams = {},
): Promise<IApiPaginationResponseWrapperType<IOrderListItemDataType>> => {
  const searchParams: Record<string, string | number> = {}
  if (params.page) searchParams.page = params.page
  if (params.limit) searchParams.limit = params.limit
  if (params.status) searchParams.status = params.status

  return kyInstance
    .get('order/my-orders', { searchParams })
    .json<IApiPaginationResponseWrapperType<IOrderListItemDataType>>()
}

export const getOrderByIdAPI = async (
  orderId: string,
): Promise<IApiResponseWrapperType<IOrderDataType>> =>
  kyInstance
    .get(`order/${orderId}`)
    .json<IApiResponseWrapperType<IOrderDataType>>()

export const cancelOrderAPI = async (
  orderId: string,
  payload: ICancelOrderPayload,
): Promise<IApiResponseWrapperType<IOrderDataType>> =>
  kyInstance
    .post(`order/${orderId}/cancel`, { json: payload })
    .json<IApiResponseWrapperType<IOrderDataType>>()
