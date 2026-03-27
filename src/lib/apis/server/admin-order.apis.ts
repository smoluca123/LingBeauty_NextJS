'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAdminOrderDataType,
  IAdminOrderListItemDataType,
  IAdminOrderFilters,
  IUpdateOrderPayload,
} from '@/lib/types/interfaces/apis/admin-order.interfaces'

/**
 * Lấy danh sách tất cả đơn hàng (Admin)
 */
export const getAllOrdersAPI = async (
  params: IAdminOrderFilters = {},
): Promise<IApiPaginationResponseWrapperType<IAdminOrderListItemDataType>> => {
  const searchParams: Record<string, string | number> = {}
  if (params.page) searchParams.page = params.page
  if (params.limit) searchParams.limit = params.limit
  if (params.userId) searchParams.userId = params.userId
  if (params.status) searchParams.status = params.status
  if (params.orderNumber) searchParams.orderNumber = params.orderNumber
  if (params.sortBy) searchParams.sortBy = params.sortBy
  if (params.order) searchParams.order = params.order

  return kyInstance
    .get('order', { searchParams })
    .json<IApiPaginationResponseWrapperType<IAdminOrderListItemDataType>>()
}

/**
 * Lấy chi tiết đơn hàng (Admin)
 */
export const getOrderByIdAdminAPI = async (
  orderId: string,
): Promise<IApiResponseWrapperType<IAdminOrderDataType>> =>
  kyInstance
    .get(`order/admin/${orderId}`)
    .json<IApiResponseWrapperType<IAdminOrderDataType>>()

/**
 * Cập nhật đơn hàng (Admin)
 */
export const updateOrderAPI = async (
  orderId: string,
  payload: IUpdateOrderPayload,
): Promise<IApiResponseWrapperType<IAdminOrderDataType>> =>
  kyInstance
    .patch(`order/${orderId}`, { json: payload })
    .json<IApiResponseWrapperType<IAdminOrderDataType>>()
