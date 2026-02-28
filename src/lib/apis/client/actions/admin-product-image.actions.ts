'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { HTTPError } from 'ky';
import type {
  IProductImageData,
  IUpdateProductImagePayload,
} from '@/lib/apis/server/actions/admin-product-image.actions';

// ─── Client Actions ───────────────────────────────────────────────────────────

/**
 * Upload an image file and attach it to the product in one step.
 * Proxied to: POST /api/admin/products/:productId/images (multipart)
 */
export const uploadProductImageClientAPI = async (
  productId: string,
  file: File,
  options?: { isPrimary?: boolean; alt?: string; variantId?: string },
): Promise<IApiResponseWrapperType<IProductImageData>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.isPrimary !== undefined) {
      formData.append('isPrimary', String(options.isPrimary));
    }
    if (options?.alt) formData.append('alt', options.alt);
    if (options?.variantId) formData.append('variantId', options.variantId);

    const response = await kyNextInstance
      .post(`admin/products/${productId}/images`, { body: formData })
      .json<IApiResponseWrapperType<IProductImageData>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to upload product image');
    }
    throw error;
  }
};

/**
 * Fetch all images for a product.
 */
export const getProductImagesClientAPI = async (
  productId: string,
): Promise<IApiResponseWrapperType<IProductImageData[]>> => {
  try {
    const response = await kyNextInstance
      .get(`admin/products/${productId}/images`)
      .json<IApiResponseWrapperType<IProductImageData[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch product images');
    }
    throw error;
  }
};

/**
 * Update a product image (e.g. set as primary).
 */
export const updateProductImageClientAPI = async (
  productId: string,
  imageId: string,
  payload: IUpdateProductImagePayload,
): Promise<IApiResponseWrapperType<IProductImageData>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/products/${productId}/images/${imageId}`, { json: payload })
      .json<IApiResponseWrapperType<IProductImageData>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update product image');
    }
    throw error;
  }
};

/**
 * Delete a product image.
 */
export const deleteProductImageClientAPI = async (
  productId: string,
  imageId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    const response = await kyNextInstance
      .delete(`admin/products/${productId}/images/${imageId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete product image');
    }
    throw error;
  }
};
