'use server';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import {
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

export const getProductsAPI = async (
  options: IProductQueryParams = { page: 1, limit: 10 },
) => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('products');
  try {
    // Build search params, omitting undefined values
    const searchParams: Record<string, string | number | boolean> = {};
    if (options.page) searchParams.page = options.page;
    if (options.limit) searchParams.limit = options.limit;
    if (options.search) searchParams.search = options.search;
    if (options.categoryId) searchParams.categoryId = options.categoryId;
    if (options.brandId) searchParams.brandId = options.brandId;
    if (options.isFeatured !== undefined)
      searchParams.isFeatured = options.isFeatured;
    if (options.minPrice !== undefined)
      searchParams.minPrice = options.minPrice;
    if (options.maxPrice !== undefined)
      searchParams.maxPrice = options.maxPrice;
    if (options.sortBy) searchParams.sortBy = options.sortBy;
    if (options.order) searchParams.order = options.order;

    const data = await publicKyInstance
      .get('product', { searchParams })
      .json<IApiPaginationResponseWrapperType<IProductDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
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
  try {
    const searchParams: Record<string, string | number | boolean> = {};
    if (options.brandId) searchParams.brandId = options.brandId;
    if (options.categoryId) searchParams.categoryId = options.categoryId;
    if (options.search) searchParams.search = options.search;
    if (options.isFeatured !== undefined)
      searchParams.isFeatured = options.isFeatured;
    if (options.minPrice !== undefined)
      searchParams.minPrice = options.minPrice;
    if (options.maxPrice !== undefined)
      searchParams.maxPrice = options.maxPrice;

    const data = await publicKyInstance
      .get('product/public/filter-categories', { searchParams })
      .json<IApiResponseWrapperType<IFilterCategoryDataType[]>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

/** Params for the product stats server API */
export interface IProductStatsQueryParams {
  brandId?: string;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
}

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
  try {
    const searchParams: Record<string, string | number | boolean> = {};
    if (options.brandId) searchParams.brandId = options.brandId;
    if (options.categoryId) searchParams.categoryId = options.categoryId;
    if (options.search) searchParams.search = options.search;
    if (options.isFeatured !== undefined)
      searchParams.isFeatured = options.isFeatured;

    const data = await publicKyInstance
      .get('product/public/stats', { searchParams })
      .json<IApiResponseWrapperType<IProductStatsDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
