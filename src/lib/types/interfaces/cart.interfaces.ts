// ===== Cart API Response Interfaces =====

export interface ICartItemProductImageMediaType {
  url: string;
  mimetype: string;
}

export interface ICartItemProductImageType {
  alt: string | null;
  media: ICartItemProductImageMediaType;
}

export interface ICartItemVariantType {
  id: string;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  type: string | null;
  price: string;
  stockQuantity: number;
  stockStatus: string;
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
  variantId: string;
  quantity: number;
  /** Line total as string (e.g. "500000.00") */
  lineTotal: string;
  product: ICartItemProductType;
  variant: ICartItemVariantType;
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
  variantId: string;
  quantity?: number;
}

export interface IUpdateCartItemPayload {
  quantity: number;
}
