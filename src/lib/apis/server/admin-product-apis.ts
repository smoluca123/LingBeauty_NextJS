'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAdminProductDataType,
  IAdminProductFilters,
  IAdminProductImage,
  IAdminProductBadge,
  IAdminProductVariant,
  ICreateProductPayload,
  ICreateProductVariantPayload,
  IUpdateProductPayload,
  IUpdateProductImagePayload,
  IUpdateProductVariantPayload,
  ICreateProductBadgePayload,
  IUpdateProductBadgePayload,
  ICreateMultipleProductBadgesPayload,
} from '@/lib/types/interfaces/apis/admin-product.interfaces'

// Helper: remove undefined values before passing to searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Get all products (Admin only)
 * @param params - Filter and pagination parameters
 * @returns Paginated product list
 * @throws Error with backend message if request fails
 */
export const getAllAdminProductsAPI = async (
  params: IAdminProductFilters = {},
) =>
  kyInstance
    .get('product', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        search: params.search,
        categoryId: params.categoryId,
        brandId: params.brandId,
        isActive: params.isActive,
        isFeatured: params.isFeatured,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IAdminProductDataType>>()

/**
 * Create product (Admin only)
 * @param data - Product data to create
 * @returns Created product data
 * @throws Error with backend message if request fails
 */
export const createAdminProductAPI = async (data: ICreateProductPayload) =>
  kyInstance
    .post('product', { json: data })
    .json<IApiResponseWrapperType<IAdminProductDataType>>()

/**
 * Update product (Admin only)
 * @param productId - Product ID to update
 * @param data - Product data to update
 * @returns Updated product data
 * @throws Error with backend message if request fails
 */
export const updateAdminProductAPI = async (
  productId: string,
  data: IUpdateProductPayload,
) =>
  kyInstance
    .patch(`product/${productId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductDataType>>()

/**
 * Get product images
 * @param productId - Product ID to fetch images for
 * @returns List of product images
 * @throws Error with backend message if request fails
 */
export const getProductImagesAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}/images`)
    .json<IApiResponseWrapperType<IAdminProductImage[]>>()

/**
 * Upload product image (multipart)
 * @param productId - Product ID to upload image for
 * @param file - Image file to upload
 * @param options - Optional image metadata
 * @returns Uploaded image data
 * @throws Error with backend message if request fails
 */
export const uploadProductImageAPI = async (
  productId: string,
  file: File,
  options?: {
    variantId?: string | null
    alt?: string | null
    isPrimary?: string | null
  },
) => {
  const formData = new FormData()
  formData.append('file', file)
  if (options?.variantId) formData.append('variantId', options.variantId)
  if (options?.alt) formData.append('alt', options.alt)
  if (options?.isPrimary) formData.append('isPrimary', options.isPrimary)

  return kyInstance
    .post(`product/${productId}/upload/image`, { body: formData })
    .json<IApiResponseWrapperType<IAdminProductImage>>()
}

/**
 * Update product image (set primary, alt, sortOrder)
 * @param productId - Product ID
 * @param imageId - Image ID to update
 * @param data - Image data to update
 * @returns Updated image data
 * @throws Error with backend message if request fails
 */
export const updateProductImageAPI = async (
  productId: string,
  imageId: string,
  data: IUpdateProductImagePayload,
) =>
  kyInstance
    .patch(`product/${productId}/images/${imageId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductImage>>()

/**
 * Delete product image
 * @param productId - Product ID
 * @param imageId - Image ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteProductImageAPI = async (
  productId: string,
  imageId: string,
) =>
  kyInstance
    .delete(`product/${productId}/images/${imageId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Reorder product images
 * @param productId - Product ID
 * @param imageIds - Array of image IDs in desired order
 * @returns Reordered image list
 * @throws Error with backend message if request fails
 */
export const reorderProductImagesAPI = async (
  productId: string,
  imageIds: string[],
) =>
  kyInstance
    .patch(`product/${productId}/images/reorder`, { json: { imageIds } })
    .json<IApiResponseWrapperType<IAdminProductImage[]>>()

/**
 * Delete product (Admin only)
 * @param productId - Product ID to delete
 * @returns Deleted product data
 * @throws Error with backend message if request fails
 */
export const deleteAdminProductAPI = async (productId: string) =>
  kyInstance
    .delete(`product/${productId}`)
    .json<IApiResponseWrapperType<IAdminProductDataType>>()

/**
 * Get product variants
 * @param productId - Product ID to fetch variants for
 * @returns List of product variants
 * @throws Error with backend message if request fails
 */
export const getProductVariantsAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}/variants`)
    .json<IApiResponseWrapperType<IAdminProductVariant[]>>()

/**
 * Add product variant
 * @param productId - Product ID to add variant to
 * @param data - Variant data to create
 * @returns Created variant data
 * @throws Error with backend message if request fails
 */
export const addProductVariantAPI = async (
  productId: string,
  data: ICreateProductVariantPayload,
) =>
  kyInstance
    .post(`product/${productId}/variants`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductVariant>>()

/**
 * Update product variant
 * @param productId - Product ID
 * @param variantId - Variant ID to update
 * @param data - Variant data to update
 * @returns Updated variant data
 * @throws Error with backend message if request fails
 */
export const updateProductVariantAPI = async (
  productId: string,
  variantId: string,
  data: IUpdateProductVariantPayload,
) =>
  kyInstance
    .patch(`product/${productId}/variants/${variantId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductVariant>>()

/**
 * Delete product variant
 * @param productId - Product ID
 * @param variantId - Variant ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteProductVariantAPI = async (
  productId: string,
  variantId: string,
) =>
  kyInstance
    .delete(`product/${productId}/variants/${variantId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Get product badges
 * @param productId - Product ID to fetch badges for
 * @returns List of product badges
 * @throws Error with backend message if request fails
 */
export const getProductBadgesAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}/badges`)
    .json<IApiResponseWrapperType<IAdminProductBadge[]>>()

/**
 * Add product badge (single)
 * @param productId - Product ID to add badge to
 * @param data - Badge data to create
 * @returns Created badge data
 * @throws Error with backend message if request fails
 */
export const addProductBadgeAPI = async (
  productId: string,
  data: ICreateProductBadgePayload,
) =>
  kyInstance
    .post(`product/${productId}/badges`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductBadge>>()

/**
 * Add multiple product badges (bulk)
 * @param productId - Product ID to add badges to
 * @param data - Array of badge data to create
 * @returns Created badges data
 * @throws Error with backend message if request fails
 */
export const addMultipleProductBadgesAPI = async (
  productId: string,
  data: ICreateMultipleProductBadgesPayload,
) =>
  kyInstance
    .post(`product/${productId}/badges/bulk`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductBadge[]>>()

/**
 * Update product badge
 * @param productId - Product ID
 * @param badgeId - Badge ID to update
 * @param data - Badge data to update
 * @returns Updated badge data
 * @throws Error with backend message if request fails
 */
export const updateProductBadgeAPI = async (
  productId: string,
  badgeId: string,
  data: IUpdateProductBadgePayload,
) =>
  kyInstance
    .patch(`product/${productId}/badges/${badgeId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductBadge>>()

/**
 * Delete product badge
 * @param productId - Product ID
 * @param badgeId - Badge ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteProductBadgeAPI = async (
  productId: string,
  badgeId: string,
) =>
  kyInstance
    .delete(`product/${productId}/badges/${badgeId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()
