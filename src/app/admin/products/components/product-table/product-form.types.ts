// ─── Shared Product Form Types ────────────────────────────────────────────────

export interface CategoryOption {
  id: string;
  name: string;
  label: string;
}

export interface BrandOption {
  id: string;
  name: string;
}

export interface ProductFormState {
  name: string;
  sku: string;
  shortDesc: string;
  description: string;
  basePrice: string;
  comparePrice: string;
  categoryIds: string[];
  brandId: string;
  isActive: boolean;
  isFeatured: boolean;
}

export const DEFAULT_PRODUCT_FORM: ProductFormState = {
  name: '',
  sku: '',
  shortDesc: '',
  description: '',
  basePrice: '',
  comparePrice: '',
  categoryIds: [],
  brandId: '',
  isActive: true,
  isFeatured: false,
};
