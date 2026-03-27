import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces'
import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'

// ============ Enums ============

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type PaymentMethod =
  | 'COD'
  | 'BANK_TRANSFER'
  | 'MOMO'
  | 'VNPAY'
  | 'ZALOPAY'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

// ============ Response Interfaces ============

export interface IOrderItemDataType {
  id: string
  orderId: string
  productId: string
  variantId: string
  name: string
  sku: string
  price: string
  quantity: number
  total: string
  createdAt: Date
  product: IProductDataType
  variant: {
    id: string
    sku: string
    name: string
    color: string | null
    size: string | null
    type: string | null
    price: string
  }
}

export interface IOrderPaymentDataType {
  id: string
  orderId: string
  method: PaymentMethod
  amount: string
  status: PaymentStatus
  transactionId?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IOrderDataType {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  subtotal: string
  tax: string
  shipping: string
  discount: string
  total: string
  shippingAddressId?: string
  affiliateCode?: string
  couponCode?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  shippingAddress?: IAddressDataType
  items: IOrderItemDataType[]
  payments: IOrderPaymentDataType[]
}

export interface IOrderListItemDataType {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  total: string
  createdAt: Date
  updatedAt: Date
  itemCount: number
}

// ============ Request Interfaces ============

export interface ICreateOrderItemPayload {
  productId: string
  variantId: string
  quantity: number
}

export interface ICreateOrderPayload {
  shippingAddressId: string
  items: ICreateOrderItemPayload[]
  paymentMethod: PaymentMethod
  couponCode?: string
  affiliateCode?: string
  notes?: string
}

export interface ICancelOrderPayload {
  reason?: string
}

// ============ Query Params ============

export interface IGetMyOrdersParams {
  page?: number
  limit?: number
  status?: OrderStatus
}

// ============ Status Helpers ============

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang chuẩn bị',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

export const CANCELLABLE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED']
