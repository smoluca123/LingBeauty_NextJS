import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'
import { IMediaDataType } from '@/lib/types/interfaces/apis/image.interfaces'

export type FlashSaleStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED'

export interface IFlashSaleProductImage {
  id: string
  productId?: string
  variantId?: string
  mediaId?: string
  alt?: string
  sortOrder: number
  isPrimary: boolean
  media: IMediaDataType
}

export interface IFlashSaleProductBadge {
  id?: string
  productId?: string
  label: string
  variant: 'freeship' | 'hot' | 'new' | 'gift' | 'PRIMARY' | 'INFO' | 'NEUTRAL'
  type?: 'NEW' | 'SALE' | 'BEST_SELLER' | 'FREESHIPPING'
  sortOrder?: number
  isActive?: boolean
}

export interface IFlashSaleProductDataType {
  id: string
  flashSaleId?: string
  productId: string
  variantId?: string
  flashPrice: number | string
  originalPrice: number | string
  maxQuantity: number
  soldQuantity: number
  limitPerOrder: number
  sortOrder: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  product: IProductDataType
  variant?: IProductVariantDataType
  badges?: IFlashSaleProductBadge[]
}

export interface IFlashSaleDataType {
  id: string
  name: string
  description?: string
  slug: string
  banner?: string
  startTime: string
  endTime: string
  status: FlashSaleStatus
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  products: IFlashSaleProductDataType[]
}

export interface ICreateFlashSaleFormData {
  name: string
  description?: string
  slug: string
  banner?: string
  startTime: string
  endTime: string
  status?: FlashSaleStatus
  isActive?: boolean
  sortOrder?: number
}

export type IUpdateFlashSaleFormData = Partial<ICreateFlashSaleFormData>

export interface IAddFlashSaleProductFormData {
  productId: string
  variantId?: string
  flashPrice: number
  originalPrice: number
  maxQuantity: number
  limitPerOrder?: number
  sortOrder?: number
}

export type IUpdateFlashSaleProductFormData =
  Partial<IAddFlashSaleProductFormData>

export interface IFlashSaleFilterParams {
  page?: number
  limit?: number
  search?: string
  status?: FlashSaleStatus
  isActive?: boolean
  sortBy?: 'createdAt' | 'name' | 'startTime' | 'endTime' | 'sortOrder'
  sortOrder?: 'asc' | 'desc'
}

export type TFlashSaleComputedStatus =
  | 'upcoming'
  | 'active'
  | 'ended'
  | 'inactive'

export interface IFlashSaleWithStatus extends IFlashSaleDataType {
  computedStatus: TFlashSaleComputedStatus
  progressPercentage: number
  timeRemaining: number
}

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getFlashSaleProductImageUrl(
  product?: IProductDataType | null,
): string | undefined {
  if (product?.images && product.images.length > 0) {
    const primaryImage = product.images.find((img) => img.isPrimary)
    if (primaryImage?.media?.url) {
      return primaryImage.media.url
    }
    if (product.images[0]?.media?.url) {
      return product.images[0].media.url
    }
  }
  return undefined
}

export const getFlashSaleVariantImageUrl = (
  variant?: IProductVariantDataType | null,
): string | undefined => {
  if (!variant?.images?.length) return undefined
  return variant.images[0]?.media?.url
}

export function isFlashSaleSoldOut(
  soldQuantity: number,
  maxQuantity: number,
): boolean {
  return soldQuantity >= maxQuantity
}

export function calculateDiscountPercent(
  originalPrice: number | string,
  flashPrice: number | string,
): number | null {
  const original =
    typeof originalPrice === 'string'
      ? parseFloat(originalPrice)
      : originalPrice
  const flash =
    typeof flashPrice === 'string' ? parseFloat(flashPrice) : flashPrice

  if (!original || !flash || original <= flash) {
    return null
  }

  return Math.round(((original - flash) / original) * 100)
}
