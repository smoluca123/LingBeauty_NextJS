import type {
  IAdminProductDataType,
  IAdminProductVariant,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

export interface SelectedProduct {
  productId: string;
  variantId?: string;
  flashPrice: number;
  originalPrice: number;
  maxQuantity: number;
  limitPerOrder: number;
}

export interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  selectedCount: number;
}

export interface ProductImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md';
}

export interface ProductItemProps {
  product: IAdminProductDataType;
  isExpanded: boolean;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  hasVariants: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
}

export interface VariantItemProps {
  variant: IAdminProductVariant;
  productId: string;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  onToggleSelect: () => void;
}

export interface ProductListProps {
  products: IAdminProductDataType[];
  isLoading: boolean;
  expandedProducts: Set<string>;
  selectedProducts: Map<string, SelectedProduct>;
  existingProductKeys: Set<string>;
  onToggleExpand: (productId: string) => void;
  onToggleSelection: (
    product: IAdminProductDataType,
    variant?: IAdminProductVariant,
  ) => void;
}

export interface SelectedProductItemProps {
  productKey: string;
  selectedProduct: SelectedProduct;
  originalProduct?: IAdminProductDataType;
  variant?: IAdminProductVariant;
  onUpdate: (key: string, updates: Partial<SelectedProduct>) => void;
  onRemove: () => void;
}

export interface SelectedProductsConfigProps {
  selectedProducts: Map<string, SelectedProduct>;
  products: IAdminProductDataType[];
  onUpdate: (key: string, updates: Partial<SelectedProduct>) => void;
  onRemove: (
    product: IAdminProductDataType,
    variant?: IAdminProductVariant,
  ) => void;
}

// Composite key: "productId" (no variant) OR "productId::variantId" (with variant)
// Using "::" separator to avoid conflicts with UUID hyphens
export const makeProductKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}::${variantId}` : productId;

export const parseProductKey = (
  key: string,
): { productId: string; variantId?: string } => {
  const parts = key.split('::');
  return {
    productId: parts[0],
    variantId: parts[1],
  };
};
