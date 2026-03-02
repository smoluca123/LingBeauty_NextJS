'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
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

// ─── Client Actions ───────────────────────────────────────────────────────────

export const getProductBadgesClientAPI = async (
  productId: string,
): Promise<IApiResponseWrapperType<IProductBadgeDataType[]>> => {
  try {
    const response = await kyNextInstance
      .get(`admin/products/${productId}/badges`)
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

export const createBadgeClientAPI = async (
  productId: string,
  data: ICreateBadgePayload,
): Promise<IApiResponseWrapperType<IProductBadgeDataType>> => {
  try {
    const response = await kyNextInstance
      .post(`admin/products/${productId}/badges`, { json: data })
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

export const createMultipleBadgesClientAPI = async (
  productId: string,
  data: ICreateMultipleBadgesPayload,
): Promise<IApiResponseWrapperType<IProductBadgeDataType[]>> => {
  try {
    const response = await kyNextInstance
      .post(`admin/products/${productId}/badges/bulk`, { json: data })
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

export const updateBadgeClientAPI = async (
  productId: string,
  badgeId: string,
  data: IUpdateBadgePayload,
): Promise<IApiResponseWrapperType<IProductBadgeDataType>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/products/${productId}/badges/${badgeId}`, { json: data })
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

export const deleteBadgeClientAPI = async (
  productId: string,
  badgeId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    const response = await kyNextInstance
      .delete(`admin/products/${productId}/badges/${badgeId}`)
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
