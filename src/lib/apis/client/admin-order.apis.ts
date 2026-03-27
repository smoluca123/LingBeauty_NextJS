import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAdminOrderDataType,
  IAdminOrderListItemDataType,
  IAdminOrderFilters,
  IUpdateOrderPayload,
} from '@/lib/types/interfaces/apis/admin-order.interfaces'

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Lấy danh sách tất cả đơn hàng (Admin)
 */
export const getAllOrdersClientAPI = async (
  params: IAdminOrderFilters = {},
): Promise<IApiPaginationResponseWrapperType<IAdminOrderListItemDataType>> => {
  try {
    return await kyNextInstance
      .get('admin/orders', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          userId: params.userId,
          status: params.status,
          orderNumber: params.orderNumber,
          sortBy: params.sortBy,
          order: params.order,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IAdminOrderListItemDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Lấy danh sách đơn hàng thất bại'),
    )
  }
}

/**
 * Lấy chi tiết đơn hàng (Admin)
 */
export const getOrderByIdAdminClientAPI = async (
  orderId: string,
): Promise<IApiResponseWrapperType<IAdminOrderDataType>> => {
  try {
    return await kyNextInstance
      .get(`admin/orders/${orderId}`)
      .json<IApiResponseWrapperType<IAdminOrderDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Lấy thông tin đơn hàng thất bại'),
    )
  }
}

/**
 * Cập nhật đơn hàng (Admin)
 */
export const updateOrderClientAPI = async (
  orderId: string,
  payload: IUpdateOrderPayload,
): Promise<IApiResponseWrapperType<IAdminOrderDataType>> => {
  try {
    return await kyNextInstance
      .patch(`admin/orders/${orderId}`, { json: payload })
      .json<IApiResponseWrapperType<IAdminOrderDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Cập nhật đơn hàng thất bại'),
    )
  }
}
