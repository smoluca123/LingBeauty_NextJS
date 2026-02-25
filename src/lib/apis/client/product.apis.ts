import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import {
  IFilterCategoryDataType,
  IProductDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { HTTPError } from 'ky';

export interface IProductListingParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'basePrice' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

/** Params for the filter-categories endpoint — same context as product listing but without pagination/sort */
export interface IFilterCategoriesParams {
  brandId?: string;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export const getProductListingAPI = async (
  params: IProductListingParams = {},
) => {
  try {
    // Build search params, omitting undefined values
    const searchParams: Record<string, string | number | boolean> = {};
    if (params.page) searchParams.page = params.page;
    if (params.limit) searchParams.limit = params.limit;
    if (params.search) searchParams.search = params.search;
    if (params.categoryId) searchParams.categoryId = params.categoryId;
    if (params.brandId) searchParams.brandId = params.brandId;
    if (params.isFeatured !== undefined)
      searchParams.isFeatured = params.isFeatured;
    if (params.minPrice !== undefined) searchParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined) searchParams.maxPrice = params.maxPrice;
    if (params.sortBy) searchParams.sortBy = params.sortBy;
    if (params.order) searchParams.order = params.order;

    const response = await kyNextInstance
      .get('product', { searchParams })
      .json<IApiPaginationResponseWrapperType<IProductDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    throw error;
  }
};

/**
 * Fetch filter categories with product counts for a given context.
 * Uses the public endpoint so no auth is required.
 */
export const getFilterCategoriesAPI = async (
  params: IFilterCategoriesParams = {},
) => {
  try {
    const searchParams: Record<string, string | number | boolean> = {};
    if (params.brandId) searchParams.brandId = params.brandId;
    if (params.categoryId) searchParams.categoryId = params.categoryId;
    if (params.search) searchParams.search = params.search;
    if (params.isFeatured !== undefined)
      searchParams.isFeatured = params.isFeatured;
    if (params.minPrice !== undefined) searchParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined) searchParams.maxPrice = params.maxPrice;

    const response = await kyNextInstance
      .get('product/public/filter-categories', { searchParams })
      .json<IApiResponseWrapperType<IFilterCategoryDataType[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch filter categories');
    }
    throw error;
  }
};
