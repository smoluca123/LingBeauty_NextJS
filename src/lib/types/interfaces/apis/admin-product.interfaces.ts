// ============ Admin Product Types ============

export interface IAdminProductDataType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDesc: string;
  basePrice: number;
  comparePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  brand: IAdminBrandDataType;
  category: IAdminCategoryDataType;
  primaryImage: string;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminBrandDataType {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface IAdminCategoryDataType {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: IAdminCategoryDataType[];
  isActive: boolean;
  sortOrder: number;
}

export interface IAdminInventoryDataType {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  quantity: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

// ============ Filter Types ============

export interface IProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  limit?: number;
}

// ============ Form Types ============

export interface IProductFormData {
  name: string;
  slug: string;
  sku: string;
  shortDesc: string;
  basePrice: number;
  comparePrice: number;
  brandId: string;
  categoryIds: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  lowStockThreshold: number;
}
