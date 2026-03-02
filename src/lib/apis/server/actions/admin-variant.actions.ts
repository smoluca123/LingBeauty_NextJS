'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
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

export const createVariantAction = async (
  productId: string,
  data: ICreateVariantPayload,
): Promise<IApiResponseWrapperType<IProductVariantDataType>> => {
  try {
    const response = await kyInstance
      .post(`product/${productId}/variants`, { json: data })
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

export const getProductVariantsAction = async (
  productId: string,
): Promise<IApiResponseWrapperType<IProductVariantDataType[]>> => {
  try {
    const response = await kyInstance
      .get(`product/${productId}/variants`)
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

export const updateVariantAction = async (
  productId: string,
  variantId: string,
  data: IUpdateVariantPayload,
): Promise<IApiResponseWrapperType<IProductVariantDataType>> => {
  try {
    const response = await kyInstance
      .patch(`product/${productId}/variants/${variantId}`, { json: data })
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

export const deleteVariantAction = async (
  productId: string,
  variantId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    const response = await kyInstance
      .delete(`product/${productId}/variants/${variantId}`)
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
