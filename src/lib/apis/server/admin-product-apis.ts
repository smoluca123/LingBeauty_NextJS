'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import {
  IApiPaginationResponseWrapperType,
  IApiPaginationParams,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

export interface IAdminProductQueryParams extends IApiPaginationParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'basePrice' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export const getAdminProductsAPI = async (
  options: IAdminProductQueryParams = { page: 1, limit: 10 },
): Promise<IApiPaginationResponseWrapperType<IAdminProductDataType>> => {
  try {
    const searchParams: Record<string, string | number | boolean> = {};
    if (options.page) searchParams.page = options.page;
    if (options.limit) searchParams.limit = options.limit;
    if (options.search) searchParams.search = options.search;
    if (options.categoryId) searchParams.categoryId = options.categoryId;
    if (options.brandId) searchParams.brandId = options.brandId;
    if (options.isActive !== undefined) searchParams.isActive = options.isActive;
    if (options.isFeatured !== undefined) searchParams.isFeatured = options.isFeatured;
    if (options.minPrice !== undefined) searchParams.minPrice = options.minPrice;
    if (options.maxPrice !== undefined) searchParams.maxPrice = options.maxPrice;
    if (options.sortBy) searchParams.sortBy = options.sortBy;
    if (options.order) searchParams.order = options.order;

    const data = await kyInstance
      .get('product', { searchParams })
      .json<IApiPaginationResponseWrapperType<IAdminProductDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
