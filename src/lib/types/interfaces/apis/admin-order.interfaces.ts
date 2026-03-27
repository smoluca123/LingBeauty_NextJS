import type {
  IOrderDataType,
  IOrderListItemDataType,
  OrderStatus,
} from '@/lib/types/interfaces/apis/order.interfaces'

// ============ Admin Order Filters ============

export interface IAdminOrderFilters {
  page?: number
  limit?: number
  userId?: string
  status?: OrderStatus
  orderNumber?: string
  sortBy?: 'createdAt' | 'total' | 'orderNumber'
  order?: 'asc' | 'desc'
}

// ============ Admin Order Update Payload ============

export interface IUpdateOrderPayload {
  status?: OrderStatus
  notes?: string
}

// ============ Re-export types from order.interfaces ============

export type {
  IOrderDataType as IAdminOrderDataType,
  IOrderListItemDataType as IAdminOrderListItemDataType,
}
