import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
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

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Fetch all products for admin with filters and pagination
 * @param params - Product filter parameters
 * @returns Promise with paginated admin product data
 * @throws Error with backend message
 */
export const getAllAdminProductsClientAPI = async (
  params: IAdminProductFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/products', {
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
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch products'),
    )
  }
}

/**
 * Create a new product (Admin)
 * @param data - Product creation payload
 * @returns Promise with created product data
 * @throws Error with backend message
 */
export const createProductClientAPI = async (data: ICreateProductPayload) => {
  try {
    return await kyNextInstance
      .post('admin/products', { json: data })
      .json<IApiResponseWrapperType<IAdminProductDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create product'),
    )
  }
}

/**
 * Update an existing product (Admin)
 * @param productId - Product ID to update
 * @param data - Product update payload
 * @returns Promise with updated product data
 * @throws Error with backend message
 */
export const updateProductClientAPI = async (
  productId: string,
  data: IUpdateProductPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update product'),
    )
  }
}

/**
 * Delete product (Admin)
 * @param productId - Product ID to delete
 * @returns Promise with deleted product data
 * @throws Error with backend message
 */
export const deleteProductClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}`)
      .json<IApiResponseWrapperType<IAdminProductDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete product'),
    )
  }
}

/**
 * Fetch product images (Admin)
 * @param productId - Product ID
 * @returns Promise with product images array
 * @throws Error with backend message
 */
export const getProductImagesClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/products/${productId}/images`)
      .json<IApiResponseWrapperType<IAdminProductImage[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch product images'),
    )
  }
}

/**
 * Upload product image (Admin)
 * @param productId - Product ID
 * @param formData - Form data containing image file
 * @returns Promise with uploaded image data
 * @throws Error with backend message
 */
export const uploadProductImageClientAPI = async (
  productId: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/upload/image`, { body: formData })
      .json<IApiResponseWrapperType<IAdminProductImage>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to upload product image'),
    )
  }
}

/**
 * Update product image properties (Admin)
 * @param productId - Product ID
 * @param imageId - Image ID to update
 * @param data - Image update payload (primary, alt, sortOrder)
 * @returns Promise with updated image data
 * @throws Error with backend message
 */
export const updateProductImageClientAPI = async (
  productId: string,
  imageId: string,
  data: IUpdateProductImagePayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/images/${imageId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductImage>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update product image'),
    )
  }
}

/**
 * Delete product image (Admin)
 * @param productId - Product ID
 * @param imageId - Image ID to delete
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteProductImageClientAPI = async (
  productId: string,
  imageId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}/images/${imageId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete product image'),
    )
  }
}

/**
 * Reorder product images (Admin)
 * @param productId - Product ID
 * @param imageIds - Array of image IDs in desired order
 * @returns Promise with reordered images array
 * @throws Error with backend message
 */
export const reorderProductImagesClientAPI = async (
  productId: string,
  imageIds: string[],
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/images/reorder`, {
        json: { imageIds },
      })
      .json<IApiResponseWrapperType<IAdminProductImage[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to reorder product images'),
    )
  }
}

/**
 * Fetch product variants (Admin)
 * @param productId - Product ID
 * @returns Promise with product variants array
 * @throws Error with backend message
 */
export const getProductVariantsClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/products/${productId}/variants`)
      .json<IApiResponseWrapperType<IAdminProductVariant[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch product variants'),
    )
  }
}

/**
 * Add product variant (Admin)
 * @param productId - Product ID
 * @param data - Variant creation payload
 * @returns Promise with created variant data
 * @throws Error with backend message
 */
export const addProductVariantClientAPI = async (
  productId: string,
  data: ICreateProductVariantPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/variants`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductVariant>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to add product variant'),
    )
  }
}

/**
 * Update product variant (Admin)
 * @param productId - Product ID
 * @param variantId - Variant ID to update
 * @param data - Variant update payload
 * @returns Promise with updated variant data
 * @throws Error with backend message
 */
export const updateProductVariantClientAPI = async (
  productId: string,
  variantId: string,
  data: IUpdateProductVariantPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/variants/${variantId}`, {
        json: data,
      })
      .json<IApiResponseWrapperType<IAdminProductVariant>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update product variant'),
    )
  }
}

/**
 * Delete product variant (Admin)
 * @param productId - Product ID
 * @param variantId - Variant ID to delete
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteProductVariantClientAPI = async (
  productId: string,
  variantId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}/variants/${variantId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete product variant'),
    )
  }
}

/**
 * Fetch product badges (Admin)
 * @param productId - Product ID
 * @returns Promise with product badges array
 * @throws Error with backend message
 */
export const getProductBadgesClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/products/${productId}/badges`)
      .json<IApiResponseWrapperType<IAdminProductBadge[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch product badges'),
    )
  }
}

/**
 * Add single product badge (Admin)
 * @param productId - Product ID
 * @param data - Badge creation payload
 * @returns Promise with created badge data
 * @throws Error with backend message
 */
export const addProductBadgeClientAPI = async (
  productId: string,
  data: ICreateProductBadgePayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/badges`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductBadge>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to add product badge'),
    )
  }
}

/**
 * Add multiple product badges in bulk (Admin)
 * @param productId - Product ID
 * @param data - Bulk badges creation payload
 * @returns Promise with created badges array
 * @throws Error with backend message
 */
export const addMultipleProductBadgesClientAPI = async (
  productId: string,
  data: ICreateMultipleProductBadgesPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/badges/bulk`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductBadge[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to add multiple product badges'),
    )
  }
}

/**
 * Update product badge (Admin)
 * @param productId - Product ID
 * @param badgeId - Badge ID to update
 * @param data - Badge update payload
 * @returns Promise with updated badge data
 * @throws Error with backend message
 */
export const updateProductBadgeClientAPI = async (
  productId: string,
  badgeId: string,
  data: IUpdateProductBadgePayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/badges/${badgeId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductBadge>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update product badge'),
    )
  }
}

/**
 * Delete product badge (Admin)
 * @param productId - Product ID
 * @param badgeId - Badge ID to delete
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteProductBadgeClientAPI = async (
  productId: string,
  badgeId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}/badges/${badgeId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete product badge'),
    )
  }
}
