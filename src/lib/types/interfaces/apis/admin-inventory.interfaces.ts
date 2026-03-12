// ============ Admin Inventory Types (mapped từ BE InventoryResponseDto) ============

export type InventoryDisplayStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

// ── Base inventory record ─────────────────────────────────────────────────────

export interface IInventoryItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  displayStatus: InventoryDisplayStatus;
  lowStockThreshold: number;
  minStockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// ── Product / Variant summary (mapped từ productSummarySelect & variantSummarySelect trên BE) ──

export interface IInventoryImageMedia {
  url: string;
  alt?: string | null;
}

export interface IInventoryImage {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
  alt?: string | null;
  media: IInventoryImageMedia;
}

export interface IInventoryBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

/** Mapped từ productSummarySelect: id, name, slug, sku, basePrice, comparePrice, isActive, brand, images[0] */
export interface IInventoryProductSummary {
  id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  comparePrice?: number | null;
  isActive: boolean;
  brand?: IInventoryBrand | null;
  images: IInventoryImage[];
}

/** Mapped từ variantSummarySelect: id, sku, name, color, size, type, price, displayType, images[0] */
export interface IInventoryVariantSummary {
  id: string;
  name: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  type?: string | null;
  price?: number | null;
  displayType?: string | null;
  images: IInventoryImage[];
}

export interface IInventoryProductItem extends IInventoryItem {
  product: IInventoryProductSummary;
}

export interface IInventoryVariantItem extends IInventoryItem {
  product: IInventoryProductSummary;
  variant: IInventoryVariantSummary;
}

// ── Overview DTO ─────────────────────────────────────────────────────────────

export interface IInventoryOverview {
  totalProducts: number;
  totalVariants: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalQuantity: number;
}

// ── Request Payloads ─────────────────────────────────────────────────────────

export interface IUpdateInventoryPayload {
  quantity?: number;
  displayStatus?: InventoryDisplayStatus;
  lowStockThreshold?: number;
  minStockQuantity?: number;
}

export interface IAdjustInventoryPayload {
  delta: number;
}

export interface IBulkAdjustItem {
  inventoryId: string;
  delta: number;
}

export interface IBulkAdjustInventoryPayload {
  items: IBulkAdjustItem[];
}
