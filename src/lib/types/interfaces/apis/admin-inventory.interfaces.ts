// ============ Admin Inventory Types (mapped từ BE InventoryResponseDto) ============

import { ProductInventoryDisplayStatus } from './product.interfaces'

/**
 * Inventory display status - re-exported from product.interfaces.ts for consistency
 */
export type { ProductInventoryDisplayStatus } from './product.interfaces'
export type InventoryDisplayStatus = ProductInventoryDisplayStatus

// ── Base inventory record ─────────────────────────────────────────────────────

export interface IInventoryItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  displayStatus: InventoryDisplayStatus
  lowStockThreshold: number
  minStockQuantity: number
  createdAt: string
  updatedAt: string
}

// ── Product / Variant summary (mapped từ productSummarySelect & variantSummarySelect trên BE) ──

export interface IInventoryImageMedia {
  url: string
  alt?: string | null
}

export interface IInventoryImage {
  id: string
  isPrimary: boolean
  sortOrder: number
  alt?: string | null
  media: IInventoryImageMedia
}

export interface IInventoryBrand {
  id: string
  name: string
  slug: string
  logo?: string | null
}

/** Mapped từ productSummarySelect: id, name, slug, sku, basePrice, comparePrice, isActive, brand, images[0] */
export interface IInventoryProductSummary {
  id: string
  name: string
  slug: string
  sku: string
  basePrice: number
  comparePrice?: number | null
  isActive: boolean
  brand?: IInventoryBrand | null
  images: IInventoryImage[]
}

/** Mapped từ variantSummarySelect: id, sku, name, color, size, type, price, displayType, images[0] */
export interface IInventoryVariantSummary {
  id: string
  name: string
  sku: string
  color?: string | null
  size?: string | null
  type?: string | null
  price?: number | null
  displayType?: string | null
  images: IInventoryImage[]
}

export interface IInventoryProductItem extends IInventoryItem {
  product: IInventoryProductSummary
}

export interface IInventoryVariantItem extends IInventoryItem {
  product: IInventoryProductSummary
  variant: IInventoryVariantSummary
}

// ── Overview DTO ─────────────────────────────────────────────────────────────

export interface IInventoryOverview {
  totalProducts: number
  totalVariants: number
  inStockCount: number
  lowStockCount: number
  outOfStockCount: number
  totalQuantity: number
}

// ── Request Payloads ─────────────────────────────────────────────────────────

export interface IUpdateInventoryPayload {
  quantity?: number
  displayStatus?: InventoryDisplayStatus
  lowStockThreshold?: number
  minStockQuantity?: number
}

export interface IAdjustInventoryPayload {
  delta: number
}

export interface IBulkAdjustItem {
  inventoryId: string
  delta: number
}

export interface IBulkAdjustInventoryPayload {
  items: IBulkAdjustItem[]
}

// ── Filter Params ────────────────────────────────────────────────────────────

export interface IInventoryFilterParams {
  page?: number
  limit?: number
  search?: string
  productId?: string
  variantId?: string
  minStock?: number
  maxStock?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface IInventoryHistoryFilterParams {
  page?: number
  limit?: number
  inventoryId?: string
  productId?: string
  variantId?: string
  type?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ── Data Types (union types for API responses) ──────────────────────────────

export type IInventoryDataType = IInventoryProductItem | IInventoryVariantItem

export interface IInventoryHistoryDataType {
  id: string
  inventoryId: string
  type: string
  quantityChange: number
  quantityBefore: number
  quantityAfter: number
  reason?: string | null
  createdAt: string
  inventory: IInventoryDataType
}

export type ILowStockProductDataType = IInventoryDataType & {
  stockLevel: 'low'
}

export type IOutOfStockProductDataType = IInventoryDataType & {
  stockLevel: 'out'
}
