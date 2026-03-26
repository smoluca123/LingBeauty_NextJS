// ============ Admin Product Types (mapped from BE ProductResponseDto) ============

import type { IAdminBrandDataType } from '@/lib/types/interfaces/apis/admin-brand.interfaces'
import type { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces'

// Enum đồng bộ với BE VariantDisplayType (Prisma)
export type VariantDisplayType = 'COLOR' | 'IMAGE'
export const VARIANT_DISPLAY_TYPES: VariantDisplayType[] = ['COLOR', 'IMAGE']

export interface IAdminProductImageMedia {
  id: string
  url: string
  mimetype: string
}

export interface IAdminProductImage {
  id: string
  variantId?: string | null
  alt?: string
  sortOrder: number
  isPrimary: boolean
  media: IAdminProductImageMedia
}

export interface IAdminProductInventory {
  quantity: number
  displayStatus: string
  lowStockThreshold: number
}

export interface IAdminProductVariant {
  id: string
  sku: string
  name: string
  color?: string
  size?: string
  type?: string
  price: string
  sortOrder: number
  displayType: VariantDisplayType
  inventory?: IAdminProductInventory
}

export type ProductBadgeVariant = 'PRIMARY' | 'INFO' | 'NEUTRAL'
export type ProductBadgeType = 'NEW' | 'SALE' | 'BEST_SELLER' | 'FREESHIPPING'

export interface IAdminProductBadge {
  id: string
  productId: string
  name: string
  sortOrder: number
  isActive: boolean
  variant?: ProductBadgeVariant
  type?: ProductBadgeType
}

export interface IAdminProductStats {
  totalSold: number
  totalRevenue: string
  avgRating?: string
  reviewCount: number
  viewCount: number
  lastSoldAt?: string
}

export interface IAdminProductCategory {
  category: IAdminCategoryDataType
}

export interface IAdminProductDataType {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  slug: string
  sku: string
  description?: string
  shortDesc?: string
  basePrice: string // BE trả về string (Decimal)
  comparePrice?: string
  isActive: boolean
  isFeatured: boolean
  weight?: string
  metaTitle?: string
  metaDesc?: string
  primaryImage?: IAdminProductImage
  productCategories: IAdminProductCategory[] // API: [{ category: {...} }]
  brand?: IAdminBrandDataType
  images: IAdminProductImage[]
  variants: IAdminProductVariant[]
  badges: IAdminProductBadge[]
  stats?: IAdminProductStats
  /** Tồn kho product-level — chỉ có khi sản phẩm KHÔNG có variant */
  inventory?: IAdminProductInventory | null
}

/** Mirrors InventoryResponseDto from BE — used in admin inventory management pages */
export interface IAdminInventoryDataType {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  displayStatus: 'IN_STOCK' | 'OUT_OF_STOCK'
  lowStockThreshold: number
  /** Backorder floor. Orders blocked when quantity drops to/below this. Default: -10 */
  minStockQuantity: number
  createdAt: string
  updatedAt: string
}

// ============ Filter / Query Types ============

export interface IAdminProductFilters {
  search?: string
  categoryId?: string
  brandId?: string
  isActive?: boolean
  isFeatured?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'basePrice' | 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// ============ Create Product Payload (maps to BE CreateProductDto) ============

export interface ICreateProductVariantPayload {
  sku?: string
  name: string
  color?: string
  size?: string
  type?: string
  price?: number
  sortOrder?: number
  displayType?: VariantDisplayType
  quantity?: number
  lowStockThreshold?: number
}

export interface IUpdateProductVariantPayload {
  sku?: string
  name?: string
  color?: string
  size?: string
  type?: string
  price?: number
  sortOrder?: number
  displayType?: VariantDisplayType
  quantity?: number
  lowStockThreshold?: number
}

export interface ICreateProductPayload {
  name: string
  categoryIds: string[]
  basePrice: number
  sku?: string
  brandId?: string
  shortDesc?: string
  description?: string
  comparePrice?: number
  isActive?: boolean
  isFeatured?: boolean
  weight?: number
  metaTitle?: string
  metaDesc?: string
  variants?: ICreateProductVariantPayload[]
}

// ============ Update Product Payload (maps to BE UpdateProductDto) ============

export interface IUpdateProductVariantInProductPayload {
  id?: string
  sku?: string
  name?: string
  color?: string
  size?: string
  type?: string
  price?: number
  sortOrder?: number
  displayType?: VariantDisplayType
  quantity?: number
  lowStockThreshold?: number
}

export interface IUpdateProductPayload {
  name?: string
  description?: string
  shortDesc?: string
  sku?: string
  categoryIds?: string[]
  brandId?: string
  basePrice?: number
  comparePrice?: number
  isActive?: boolean
  isFeatured?: boolean
  weight?: number
  metaTitle?: string
  metaDesc?: string
  variants?: IUpdateProductVariantInProductPayload[]
}

// ============ Product Image Payloads ============

export interface IUploadProductImagePayload {
  alt?: string
  isPrimary?: boolean
  variantId?: string
}

export interface IUpdateProductImagePayload {
  alt?: string
  sortOrder?: number
  isPrimary?: boolean
}

// ============ Product Badge Payloads ============

export interface ICreateProductBadgePayload {
  name: string
  sortOrder?: number
  isActive?: boolean
  variant?: ProductBadgeVariant
  type?: ProductBadgeType
}

export interface IUpdateProductBadgePayload {
  name?: string
  sortOrder?: number
  isActive?: boolean
  variant?: ProductBadgeVariant
  type?: ProductBadgeType
}

export interface ICreateMultipleProductBadgesPayload {
  badges: ICreateProductBadgePayload[]
}

// ============ Form Types ============

export interface IProductFormData {
  name: string
  slug: string
  sku: string
  shortDesc: string
  description: string
  basePrice: number
  comparePrice: number
  brandId: string
  categoryIds: string[]
  isActive: boolean
  isFeatured: boolean
  weight: number
  variants: ICreateProductVariantPayload[]
}

// ============ Helper: tính tổng tồn kho ============
export function getTotalStock(product: IAdminProductDataType): number {
  // Sản phẩm có variant: cộng tồn kho từng variant
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce(
      (total, v) => total + (v.inventory?.quantity ?? 0),
      0,
    )
  }
  // Sản phẩm đơn giản: dùng inventory product-level
  return product.inventory?.quantity ?? 0
}

// ============ Helper: lấy URL ảnh chính ============
export function getPrimaryImageUrl(product: IAdminProductDataType): string {
  return product.primaryImage?.media?.url ?? '/images/placeholder.png'
}

// ============ Helper: lấy tên danh mục đầu tiên ============
export function getFirstCategory(
  product: IAdminProductDataType,
): IAdminCategoryDataType | undefined {
  return product.productCategories?.[0]?.category
}
