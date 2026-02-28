'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { HTTPError } from 'ky';

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

export const createProductAction = async (
  data: ICreateProductPayload,
): Promise<IApiResponseWrapperType<IAdminProductDataType>> => {
  try {
    const response = await kyInstance
      .post('product', { json: data })
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

export const updateProductAction = async (
  id: string,
  data: IUpdateProductPayload,
): Promise<IApiResponseWrapperType<IAdminProductDataType>> => {
  try {
    const response = await kyInstance
      .patch(`product/${id}`, { json: data })
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

export const deleteProductAction = async (
  id: string,
): Promise<IApiResponseWrapperType<IAdminProductDataType>> => {
  try {
    const response = await kyInstance
      .delete(`product/${id}`)
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
