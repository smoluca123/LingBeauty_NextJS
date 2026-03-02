'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import {
  IProductBadgeDataType,
  ProductBadgeType,
  ProductBadgeVariantType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { HTTPError } from 'ky';

// ─── Payload Types ────────────────────────────────────────────────────────────

export interface ICreateBadgePayload {
  name: string;
  sortOrder?: number;
  isActive?: boolean;
  variant?: ProductBadgeVariantType;
  type?: ProductBadgeType;
}

export interface ICreateMultipleBadgesPayload {
  badges: ICreateBadgePayload[];
}

export interface IUpdateBadgePayload {
  name?: string;
  sortOrder?: number;
  isActive?: boolean;
  variant?: ProductBadgeVariantType;
  type?: ProductBadgeType;
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export const getProductBadgesAction = async (
  productId: string,
): Promise<IApiResponseWrapperType<IProductBadgeDataType[]>> => {
  try {
    const response = await kyInstance
      .get(`product/${productId}/badges`)
      .json<IApiResponseWrapperType<IProductBadgeDataType[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch badges');
    }
    throw error;
  }
};

export const createBadgeAction = async (
  productId: string,
  data: ICreateBadgePayload,
): Promise<IApiResponseWrapperType<IProductBadgeDataType>> => {
  try {
    const response = await kyInstance
      .post(`product/${productId}/badges`, { json: data })
      .json<IApiResponseWrapperType<IProductBadgeDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create badge');
    }
    throw error;
  }
};

export const createMultipleBadgesAction = async (
  productId: string,
  data: ICreateMultipleBadgesPayload,
): Promise<IApiResponseWrapperType<IProductBadgeDataType[]>> => {
  try {
    const response = await kyInstance
      .post(`product/${productId}/badges/bulk`, { json: data })
      .json<IApiResponseWrapperType<IProductBadgeDataType[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create badges');
    }
    throw error;
  }
};

export const updateBadgeAction = async (
  productId: string,
  badgeId: string,
  data: IUpdateBadgePayload,
): Promise<IApiResponseWrapperType<IProductBadgeDataType>> => {
  try {
    const response = await kyInstance
      .patch(`product/${productId}/badges/${badgeId}`, { json: data })
      .json<IApiResponseWrapperType<IProductBadgeDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update badge');
    }
    throw error;
  }
};

export const deleteBadgeAction = async (
  productId: string,
  badgeId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    const response = await kyInstance
      .delete(`product/${productId}/badges/${badgeId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete badge');
    }
    throw error;
  }
};
