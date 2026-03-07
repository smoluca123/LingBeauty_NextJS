import { IMediaDataType } from '@/lib/types/interfaces/apis/image.interfaces';

export interface IProductDetailStatsDataType {
  totalSold: number;
  totalRevenue?: string;
  avgRating?: string;
  reviewCount: number;
  viewCount: number;
  lastSoldAt?: string;
}

export interface IProductDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  sku: string;
  basePrice: string;
  comparePrice?: string;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDesc?: string;
  brand: IProductBrandDataType;
  primaryImage?: IProductImageDataType;
  productCategories: IProductCategoryDataType[];
  images?: IProductImageDataType[];
  variants: IProductVariantDataType[];
  badges: IProductBadgeDataType[];
  stats?: IProductDetailStatsDataType;
}

export type VariantDisplayType = 'COLOR' | 'IMAGE';

export interface IProductVariantDataType {
  id: string;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  type: string | null;
  price: string;
  sortOrder: number;
  displayType: VariantDisplayType;
  inventory: IProductInventoryDataType;
  images: IProductImageDataType[];
}

export interface IProductImageDataType {
  id: string;
  productId: string;
  variantId: string;
  mediaId: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
  media: IMediaDataType;
}

interface IProductInventoryDataType {
  quantity: number;
  displayStatus: string;
  lowStockThreshold: number;
}

interface IProductCategoryDataType {
  category: ICategoryDataType;
}

interface ICategoryDataType {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageMediaId: null;
  parentId: null;
  type: string;
  brand: null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  imageMedia: null;
}

// interface IProductImageDataType {
//   id: string;
//   alt: string;
//   sortOrder: number;
//   isPrimary: boolean;
//   media: IMediaDataType;
//   productId: string;
//   variantId: null;
//   mediaId: string;
// }

interface IProductBrandDataType {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoMediaId: string;
  website: null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  logoMedia: IMediaDataType;
}

interface IProductBadgeDataType {
  id: string;
  productId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  variant: ProductBadgeVariantType;
  type: ProductBadgeType;
}

export type ProductBadgeType = 'NEW' | 'SALE' | 'BEST_SELLER' | 'FREESHIPPING';
export type ProductBadgeVariantType = 'INFO' | 'PRIMARY' | 'NEUTRAL';

/** Filter category returned by the filter-categories endpoint */
export interface IFilterCategoryDataType {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/** Lightweight product stats returned by the stats endpoint */
export interface IProductStatsDataType {
  productCount: number;
  totalSold: number;
}
