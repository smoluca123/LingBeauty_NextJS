export interface CartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
}

export interface CartItemWithProduct extends CartItem {
  product: any; // Will be populated from IProductDataType
  selectedVariant?: any; // Will be populated from IProductVariantDataType
}
