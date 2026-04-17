import { IMediaDataType } from '@/lib/types/interfaces/apis/image.interfaces'
import type {
  VariantDisplayType,
  ProductBadgeType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces'

/** Mirrors the Prisma enum — enum only has IN_STOCK / OUT_OF_STOCK.
 *  Low-stock is NOT a DB status; it is derived by comparing quantity <= lowStockThreshold. */
export type ProductInventoryDisplayStatus = 'IN_STOCK' | 'OUT_OF_STOCK'

export type ProductType = 'INVENTORY' | 'AFFILIATE'

// Re-export shared types from admin-product for consistency
export type { VariantDisplayType, ProductBadgeType }
export type ProductBadgeVariantType = 'INFO' | 'PRIMARY' | 'NEUTRAL'

export interface IProductDetailStatsDataType {
  totalSold: number
  totalRevenue?: string
  avgRating?: string
  reviewCount: number
  viewCount: number
  lastSoldAt?: string
}

export interface IProductDataType {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  slug: string
  description?: string
  shortDesc?: string
  sku: string
  basePrice: string
  comparePrice?: string
  isActive: boolean
  isFeatured: boolean
  metaTitle?: string
  metaDesc?: string
  productType: ProductType
  affiliateLink?: string
  affiliateSource?: string
  brand: IProductBrandDataType
  // primaryImage?: IProductImageDataType
  productCategories: IProductCategoryDataType[]
  images?: IProductImageDataType[]
  variants: IProductVariantDataType[]
  badges: IProductBadgeDataType[]
  stats?: IProductDetailStatsDataType
  /** Product-level inventory (only present for products WITHOUT variants) */
  inventory?: IProductInventoryDataType | null
}

/**
 * Minimal product info for embedding in other responses (e.g. inventory, order list).
 * Matches backend ProductSummaryResponseDto
 */
export interface IProductSummaryDataType {
  id: string
  name: string
  slug: string
  sku: string | null
  basePrice: string
  comparePrice?: string | null
  isActive: boolean
  productType: ProductType
  affiliateLink?: string
  affiliateSource?: string
  brand?: IProductBrandDataType | null
  images: IProductImageDataType[]
}

export interface IProductVariantDataType {
  id: string
  sku: string
  name: string
  color: string | null
  size: string | null
  type: string | null
  price: string
  sortOrder: number
  displayType: VariantDisplayType
  inventory: IProductInventoryDataType
  images: IProductImageDataType[]
}

/**
 * Minimal variant info for embedding in other responses (e.g. inventory, order list).
 * Matches backend VariantSummaryResponseDto
 */
export interface IVariantSummaryDataType {
  id: string
  sku: string
  name: string
  color: string | null
  size: string | null
  type: string | null
  price: string
  displayType: VariantDisplayType
  images: IProductImageDataType[]
}

export interface IProductImageDataType {
  id: string
  productId: string
  variantId: string
  mediaId: string
  alt: string
  sortOrder: number
  isPrimary: boolean
  media: IMediaDataType
}

export interface IProductInventoryDataType {
  /** Present in full inventory responses; absent in embedded variant/product snapshots */
  id?: string
  productId?: string
  variantId?: string | null
  quantity: number
  displayStatus: ProductInventoryDisplayStatus
  lowStockThreshold: number
  /** Backorder floor: minimum stock allowed. Negative = backorder units permitted. Default: -10 */
  minStockQuantity: number
  createdAt?: string
  updatedAt?: string
}

interface IProductCategoryDataType {
  category: ICategoryDataType
}

interface ICategoryDataType {
  id: string
  name: string
  slug: string
  description: string
  imageMediaId: null
  parentId: null
  type: string
  brand: null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  imageMedia: null
}

// interface IProductImageDataType {
//   id: string;
//   alt: string;
//   sortOrder: number;
//   isPrimary: boolean;
//   media: IMediaDataType;
//   productId: string;
//   variantId: null;
//   mediaId: string;
// }

interface IProductBrandDataType {
  id: string
  name: string
  slug: string
  description: string
  logoMediaId: string
  website: null
  isActive: boolean
  createdAt: string
  updatedAt: string
  logoMedia: IMediaDataType
}

interface IProductBadgeDataType {
  id: string
  productId: string
  name: string
  sortOrder: number
  isActive: boolean
  variant: ProductBadgeVariantType
  type: ProductBadgeType
}

/** Filter category returned by the filter-categories endpoint */
export interface IFilterCategoryDataType {
  id: string
  name: string
  slug: string
  count: number
}

/** Lightweight product stats returned by the stats endpoint */
export interface IProductStatsDataType {
  productCount: number
  totalSold: number
}
