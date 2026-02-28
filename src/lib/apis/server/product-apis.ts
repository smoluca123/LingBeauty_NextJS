'use server';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import type {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IFilterCategoryDataType,
  IProductDataType,
  IProductStatsDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { cacheLife, cacheTag } from 'next/cache';

export interface IProductQueryParams extends IApiPaginationParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'basePrice' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

/** Params for the filter-categories server API */
export interface IFilterCategoriesQueryParams {
  brandId?: string;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/** Params for the product stats server API */
export interface IProductStatsQueryParams {
  brandId?: string;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
}

// Helper: build search params object, omitting undefined values
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

export const getProductsAPI = async (
  options: IProductQueryParams = { page: 1, limit: 10 },
) => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('products');
  return publicKyInstance
    .get('product', {
      searchParams: buildSearchParams({
        page: options.page,
        limit: options.limit,
        search: options.search,
        categoryId: options.categoryId,
        brandId: options.brandId,
        isFeatured: options.isFeatured,
        minPrice: options.minPrice,
        maxPrice: options.maxPrice,
        sortBy: options.sortBy,
        order: options.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IProductDataType>>();
};

/**
 * Fetch filter categories from the NestJS public endpoint.
 * Returns distinct categories with product counts for filter sidebar.
 */
export const getFilterCategoriesAPI = async (
  options: IFilterCategoriesQueryParams = {},
) => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('filter-categories');
  return publicKyInstance
    .get('product/public/filter-categories', {
      searchParams: buildSearchParams({
        brandId: options.brandId,
        categoryId: options.categoryId,
        search: options.search,
        isFeatured: options.isFeatured,
        minPrice: options.minPrice,
        maxPrice: options.maxPrice,
      }),
    })
    .json<IApiResponseWrapperType<IFilterCategoryDataType[]>>();
};

/**
 * Fetch lightweight product stats (productCount + totalSold).
 * Uses aggregate queries on the backend — much cheaper than fetching all products.
 */
export const getProductStatsAPI = async (
  options: IProductStatsQueryParams = {},
) => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('product-stats');
  return publicKyInstance
    .get('product/public/stats', {
      searchParams: buildSearchParams({
        brandId: options.brandId,
        categoryId: options.categoryId,
        search: options.search,
        isFeatured: options.isFeatured,
      }),
    })
    .json<IApiResponseWrapperType<IProductStatsDataType>>();
};
