// ===== Cart API Response Interfaces =====

import type { ProductInventoryDisplayStatus } from '@/lib/types/interfaces/apis/product.interfaces';

export interface ICartItemProductImageMediaType {
  url: string;
  mimetype: string;
}

export interface ICartItemProductImageType {
  alt: string | null;
  media: ICartItemProductImageMediaType;
}

/** Low-stock threshold config — matches server DEFAULT (lowStockThreshold field driven per-variant) */
export const CART_LOW_STOCK_DISPLAY_THRESHOLD = 10;

/** Stock info — always present, use for stock logic (not variant) */
export interface ICartItemStockInfoType {
  stockQuantity: number;
  /** Backorder floor: minimum stock quantity allowed. Defaults to -10 server-side. */
  minStockQuantity: number;
  stockStatus: ProductInventoryDisplayStatus;
}

/** Variant display fields — null for products without variants */
export interface ICartItemVariantType {
  id: string;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  type: string | null;
  price: string;
}

export interface ICartItemProductType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: string;
  comparePrice: string | null;
  isActive: boolean;
  thumbnailImage: ICartItemProductImageType | null;
}

export interface ICartItemType {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  /** Line total as string (e.g. "500000.00") */
  lineTotal: string;
  product: ICartItemProductType;
  /** Null for products without variants. Use for display only (color/size/type). */
  variant: ICartItemVariantType | null;
  /** Always present. Use this for all stock validation logic. */
  stockInfo: ICartItemStockInfoType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartSummaryType {
  itemCount: number;
  totalQuantity: number;
  /** Subtotal before discounts as string */
  subtotal: string;
}

export interface ICartDataType {
  id: string;
  userId: string;
  items: ICartItemType[];
  summary: ICartSummaryType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartCountType {
  itemCount: number;
  totalQuantity: number;
}

// ===== Cart Request Interfaces =====

export interface IAddToCartPayload {
  productId: string;
  /** Omit for no-variant products — BE will auto-resolve the first variant */
  variantId?: string;
  quantity?: number;
}

export interface IUpdateCartItemPayload {
  quantity: number;
}
