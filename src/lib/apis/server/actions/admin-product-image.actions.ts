'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { HTTPError } from 'ky';

// ─── Response Types ───────────────────────────────────────────────────────────

export interface IProductImageData {
  id: string;
  productId: string;
  variantId: string | null;
  mediaId: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  media: {
    id: string;
    url: string;
    mimetype: string;
  };
}

// ─── Payload Types ────────────────────────────────────────────────────────────

export interface IAddProductImagePayload {
  mediaId: string;
  isPrimary?: boolean;
  alt?: string;
  sortOrder?: number;
}

export interface IUpdateProductImagePayload {
  isPrimary?: boolean;
  alt?: string;
  sortOrder?: number;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Upload file + attach to product in one step.
 *
 * BE endpoint: POST /product/:id/upload/image
 * Multipart fields:
 *   - file       (required) – image binary
 *   - isPrimary  (optional) – string 'true' | 'false'
 *   - alt        (optional) – string
 *   - variantId  (optional) – uuid string
 *
 * Returns: ProductImageResponseDto (already linked to the product)
 */
export const uploadProductImageAction = async (
  productId: string,
  formData: FormData,
): Promise<IApiResponseWrapperType<IProductImageData>> => {
  try {
    const response = await kyInstance
      .post(`product/${productId}/upload/image`, { body: formData })
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
 * Get all images for a product.
 * BE endpoint: GET /product/:id/images
 */
export const getProductImagesAction = async (
  productId: string,
): Promise<IApiResponseWrapperType<IProductImageData[]>> => {
  try {
    const response = await kyInstance
      .get(`product/${productId}/images`)
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
 * Update a specific product image (e.g. set as primary).
 * BE endpoint: PATCH /product/:id/images/:imageId
 */
export const updateProductImageAction = async (
  productId: string,
  imageId: string,
  payload: IUpdateProductImagePayload,
): Promise<IApiResponseWrapperType<IProductImageData>> => {
  try {
    const response = await kyInstance
      .patch(`product/${productId}/images/${imageId}`, { json: payload })
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
 * BE endpoint: DELETE /product/:id/images/:imageId
 */
export const deleteProductImageAction = async (
  productId: string,
  imageId: string,
): Promise<IApiResponseWrapperType<{ message: string }>> => {
  try {
    const response = await kyInstance
      .delete(`product/${productId}/images/${imageId}`)
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
