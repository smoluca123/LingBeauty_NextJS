'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { HTTPError } from 'ky';

export interface IAdminProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'basePrice' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface ICreateProductPayload {
  name: string;
  sku: string;
  shortDesc?: string;
  description?: string;
  basePrice: number;
  comparePrice?: number;
  brandId?: string;
  categoryIds?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface IUpdateProductPayload {
  name?: string;
  sku?: string;
  shortDesc?: string;
  description?: string;
  basePrice?: number;
  comparePrice?: number;
  brandId?: string;
  categoryIds?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export const getAdminProductsClientAPI = async (
  params: IAdminProductQueryParams = { page: 1, limit: 10 },
): Promise<IApiPaginationResponseWrapperType<IAdminProductDataType>> => {
  try {
    const searchParams: Record<string, string> = {};
    if (params.page) searchParams.page = String(params.page);
    if (params.limit) searchParams.limit = String(params.limit);
    if (params.search) searchParams.search = params.search;
    if (params.categoryId) searchParams.categoryId = params.categoryId;
    if (params.brandId) searchParams.brandId = params.brandId;
    if (params.isActive !== undefined) searchParams.isActive = String(params.isActive);
    if (params.isFeatured !== undefined) searchParams.isFeatured = String(params.isFeatured);
    if (params.sortBy) searchParams.sortBy = params.sortBy;
    if (params.order) searchParams.order = params.order;

    const response = await kyNextInstance
      .get('admin/products', { searchParams })
      .json<IApiPaginationResponseWrapperType<IAdminProductDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    throw error;
  }
};

export const createProductClientAPI = async (
  data: ICreateProductPayload,
): Promise<IApiResponseWrapperType<IAdminProductDataType>> => {
  try {
    const response = await kyNextInstance
      .post('admin/products', { json: data })
      .json<IApiResponseWrapperType<IAdminProductDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    throw error;
  }
};

export const updateProductClientAPI = async (
  id: string,
  data: IUpdateProductPayload,
): Promise<IApiResponseWrapperType<IAdminProductDataType>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/products/${id}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }
    throw error;
  }
};

export const deleteProductClientAPI = async (
  id: string,
): Promise<IApiResponseWrapperType<IAdminProductDataType>> => {
  try {
    const response = await kyNextInstance
      .delete(`admin/products/${id}`)
      .json<IApiResponseWrapperType<IAdminProductDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }
    throw error;
  }
};
