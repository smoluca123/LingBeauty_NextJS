/**
 * Flash Sale Status enum - matches server FlashSaleStatus
 */
export type TFlashSaleStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED';

// ── Product nested types (matches productSelect + productVariantSelect in BE) ──

export interface IFlashSaleProductImage {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
  alt?: string;
  media: {
    id: string;
    url: string;
    type?: string;
  };
}

export interface IFlashSaleNestedVariant {
  id: string;
  sku?: string;
  name?: string;
  color?: string;
  size?: string;
  price: string | number;
  displayType?: string;
  images?: IFlashSaleProductImage[];
}

export interface IFlashSaleNestedProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  basePrice: string | number;
  isActive: boolean;
  /** images[0] with isPrimary or sortOrder=0 */
  images?: IFlashSaleProductImage[];
}

/**
 * Flash Sale Product data interface - matches server FlashSaleProductResponseDto
 * + flashSaleProductSelect (includes nested product & variant)
 */
export interface IFlashSaleProductDataType {
  id: string;
  flashSaleId: string;
  productId: string;
  variantId?: string;
  flashPrice: string | number;
  originalPrice: string | number;
  maxQuantity: number;
  soldQuantity: number;
  limitPerOrder: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  product?: IFlashSaleNestedProduct;
  variant?: IFlashSaleNestedVariant;
}

/**
 * Helper: get the primary image URL from a nested product
 */
export const getFlashSaleProductImageUrl = (
  product?: IFlashSaleNestedProduct,
): string | undefined => {
  if (!product?.images?.length) return undefined;
  const primary = product.images.find((img) => img.isPrimary);
  return (primary ?? product.images[0])?.media?.url;
};

/**
 * Helper: get the primary image URL from a nested variant
 */
export const getFlashSaleVariantImageUrl = (
  variant?: IFlashSaleNestedVariant,
): string | undefined => {
  if (!variant?.images?.length) return undefined;
  return variant.images[0]?.media?.url;
};

/**
 * Flash Sale data interface - matches server FlashSaleResponseDto
 */
export interface IFlashSaleDataType {
  id: string;
  name: string;
  description?: string;
  slug: string;
  banner?: string;
  startTime: string | Date;
  endTime: string | Date;
  status: TFlashSaleStatus;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  products?: IFlashSaleProductDataType[];
}

/**
 * Form data for creating a flash sale
 */
export interface ICreateFlashSaleFormData {
  name: string;
  description?: string;
  slug: string;
  banner?: string;
  startTime: string;
  endTime: string;
  status?: TFlashSaleStatus;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Form data for updating a flash sale
 */
export type IUpdateFlashSaleFormData = Partial<ICreateFlashSaleFormData>;

/**
 * Form data for adding a product to flash sale
 */
export interface IAddFlashSaleProductFormData {
  productId: string;
  variantId?: string;
  flashPrice: number;
  originalPrice: number;
  maxQuantity: number;
  limitPerOrder?: number;
  sortOrder?: number;
}

/**
 * Form data for updating a flash sale product
 */
export type IUpdateFlashSaleProductFormData =
  Partial<IAddFlashSaleProductFormData>;

/**
 * Flash sale filter params for list queries
 */
export interface IFlashSaleFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TFlashSaleStatus;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'name' | 'startTime' | 'endTime' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Computed flash sale status for UI display
 */
export type TFlashSaleComputedStatus =
  | 'upcoming'
  | 'active'
  | 'ended'
  | 'inactive';

/**
 * Extended flash sale data with computed status
 */
export interface IFlashSaleWithStatus extends IFlashSaleDataType {
  computedStatus: TFlashSaleComputedStatus;
  progressPercentage: number;
  timeRemaining: number; // in milliseconds
// ═══════════════════════════════════════════════════════════════════════════════
// Flash Sale Module TypeScript Interfaces
// Synchronized with backend entities and DTOs
// ═══════════════════════════════════════════════════════════════════════════════

import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { IMediaDataType } from './image.interfaces';

// ───────────────────────────────────────────────────────────────────────────────
// Enums
// ───────────────────────────────────────────────────────────────────────────────

export type FlashSaleStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

// ───────────────────────────────────────────────────────────────────────────────
// Product Image (from BE productImageSelect)
// ───────────────────────────────────────────────────────────────────────────────

export interface IFlashSaleProductImage {
  id: string;
  productId?: string;
  variantId?: string | null;
  mediaId?: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
  media: IMediaDataType;
}

// ───────────────────────────────────────────────────────────────────────────────
// Flash Sale Product (from BE flashSaleProductSelect)
// ───────────────────────────────────────────────────────────────────────────────

export interface IFlashSaleProductDataType {
  id: string;
  productId: string;
  variantId?: string | null;
  flashPrice: number | string;
  originalPrice: number | string;
  maxQuantity: number;
  soldQuantity: number;
  limitPerOrder: number;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Product data from productSelect
  product: IProductDataType;
  // Optional variant data from productVariantSelect
  variant?: IProductVariantDataType | null;
  badges?: IFlashSaleProductBadge[];
}

// ───────────────────────────────────────────────────────────────────────────────
// Product Badge
// ───────────────────────────────────────────────────────────────────────────────

export interface IFlashSaleProductBadge {
  id?: string;
  productId?: string;
  label: string;
  variant: 'freeship' | 'hot' | 'new' | 'gift' | 'PRIMARY' | 'INFO' | 'NEUTRAL';
  type?: 'NEW' | 'SALE' | 'BEST_SELLER' | 'FREESHIPPING';
  sortOrder?: number;
  isActive?: boolean;
}

// ───────────────────────────────────────────────────────────────────────────────
// Flash Sale Main Interface (from BE flashSaleSelect)
// ───────────────────────────────────────────────────────────────────────────────

export interface IFlashSaleDataType {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  banner?: string | null;
  startTime: string;
  endTime: string;
  status: FlashSaleStatus;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  products: IFlashSaleProductDataType[];
}

// ───────────────────────────────────────────────────────────────────────────────
// Helper Types
// ───────────────────────────────────────────────────────────────────────────────

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ───────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Get primary image URL from product or variant images
 * Priority: 1. Variant primary image, 2. Product primary image, 3. First product image, 4. Placeholder
 */
export function getFlashSaleProductImageUrl(
  product: IFlashSaleProductDataType,
): string {
  // If variant exists with images, prioritize variant images
  if (product.variant?.images && product.variant.images.length > 0) {
    const primaryImage = product.variant.images.find((img) => img.isPrimary);
    if (primaryImage?.media?.url) {
      return primaryImage.media.url;
    }
    // Fallback to first variant image
    if (product.variant.images[0]?.media?.url) {
      return product.variant.images[0].media.url;
    }
  }

  // Fallback to product images
  if (product.product?.images && product.product.images.length > 0) {
    const primaryImage = product.product.images.find((img) => img.isPrimary);
    if (primaryImage?.media?.url) {
      return primaryImage.media.url;
    }
    // Fallback to first product image
    if (product.product.images[0]?.media?.url) {
      return product.product.images[0].media.url;
    }
  }

  // Final fallback to placeholder
  return '/images/placeholder.png';
}

/**
 * Check if flash sale product is sold out
 */
export function isFlashSaleSoldOut(
  soldQuantity: number,
  maxQuantity: number,
): boolean {
  return soldQuantity >= maxQuantity;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(
  originalPrice: number | string,
  flashPrice: number | string,
): number | null {
  const original =
    typeof originalPrice === 'string'
      ? parseFloat(originalPrice)
      : originalPrice;
  const flash =
    typeof flashPrice === 'string' ? parseFloat(flashPrice) : flashPrice;

  if (!original || !flash || original <= flash) {
    return null;
  }

  return Math.round(((original - flash) / original) * 100);
}
