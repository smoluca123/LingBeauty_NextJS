// Wishlist Types

import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'

export interface IWishlistItemType {
  id: string
  userId: string
  productId: string
  variantId: string | null
  note: string | null
  product: IProductDataType
  variant: IProductVariantDataType | null
  createdAt: string
  updatedAt: string
}

export interface IWishlistResponseType {
  items: IWishlistItemType[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface ISharedWishlistType {
  id: string
  userId: string
  shareToken: string
  title: string | null
  description: string | null
  isPublic: boolean
  expiresAt: string | null
  viewCount: number
  shareUrl: string
  createdAt: string
  updatedAt: string
}

export interface ISharedWishlistDetailType extends ISharedWishlistType {
  items: IWishlistItemType[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

// Request DTOs
export interface IAddToWishlistDto {
  productId: string
  variantId?: string
  note?: string
}

export interface IUpdateWishlistItemDto {
  note?: string
}

export interface ICreateSharedWishlistDto {
  title?: string
  description?: string
  isPublic?: boolean
  expiresAt?: string
}

export interface IMoveToCartDto {
  wishlistItemId: string
  quantity?: number
}

export interface ICheckWishlistStatusDto {
  productId: string
  variantId?: string
}

export interface IWishlistStatusResponse {
  isInWishlist: boolean
  wishlistItemId: string | null
}
