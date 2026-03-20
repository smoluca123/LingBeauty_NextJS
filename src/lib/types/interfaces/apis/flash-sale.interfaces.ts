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
}
