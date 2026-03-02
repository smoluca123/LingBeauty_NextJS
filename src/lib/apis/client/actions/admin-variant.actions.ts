'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { HTTPError } from 'ky';

export interface ICreateVariantPayload {
  name: string;
  sku?: string;
  color?: string;
  size?: string;
  type?: string;
  price?: number;
  quantity?: number;
  lowStockThreshold?: number;
  sortOrder?: number;
}

export const createVariantClientAPI = async (
  productId: string,
  data: ICreateVariantPayload,
): Promise<IApiResponseWrapperType<IProductVariantDataType>> => {
  try {
    const response = await kyNextInstance
      .post(`admin/products/${productId}/variants`, { json: data })
      .json<IApiResponseWrapperType<IProductVariantDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create variant');
    }
    throw error;
  }
};

export const getProductVariantsClientAPI = async (
  productId: string,
): Promise<IApiResponseWrapperType<IProductVariantDataType[]>> => {
  try {
    const response = await kyNextInstance
      .get(`admin/products/${productId}/variants`)
      .json<IApiResponseWrapperType<IProductVariantDataType[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch variants');
    }
    throw error;
  }
};

export interface IUpdateVariantPayload {
  name?: string;
  sku?: string;
  color?: string;
  size?: string;
  type?: string;
  price?: number;
  quantity?: number;
  lowStockThreshold?: number;
  sortOrder?: number;
}

export const updateVariantClientAPI = async (
  productId: string,
  variantId: string,
  data: IUpdateVariantPayload,
): Promise<IApiResponseWrapperType<IProductVariantDataType>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/products/${productId}/variants/${variantId}`, { json: data })
      .json<IApiResponseWrapperType<IProductVariantDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update variant');
    }
    throw error;
  }
};

export const deleteVariantClientAPI = async (
  productId: string,
  variantId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    const response = await kyNextInstance
      .delete(`admin/products/${productId}/variants/${variantId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete variant');
    }
    throw error;
  }
};
