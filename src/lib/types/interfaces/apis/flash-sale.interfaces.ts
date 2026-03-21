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
