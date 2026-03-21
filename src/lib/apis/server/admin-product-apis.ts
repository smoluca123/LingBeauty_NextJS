'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
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
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Get All Products (Admin - yêu cầu auth JWT) ============
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
    .json<IApiPaginationResponseWrapperType<IAdminProductDataType>>();

// ============ Get Product by ID (Admin - yêu cầu auth JWT) ============
export const getAdminProductByIdAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}`)
    .json<IApiResponseWrapperType<IAdminProductDataType>>();

// ============ Create Product (Admin - yêu cầu auth JWT) ============
export const createAdminProductAPI = async (data: ICreateProductPayload) =>
  kyInstance
    .post('product', { json: data })
    .json<IApiResponseWrapperType<IAdminProductDataType>>();

// ============ Update Product (Admin - yêu cầu auth JWT) ============
export const updateAdminProductAPI = async (
  productId: string,
  data: IUpdateProductPayload,
) =>
  kyInstance
    .patch(`product/${productId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductDataType>>();

// ============ Get Product Images ============
export const getProductImagesAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}/images`)
    .json<IApiResponseWrapperType<IAdminProductImage[]>>();

// ============ Upload Product Image (multipart) ============
export const uploadProductImageAPI = async (
  productId: string,
  file: File,
  options?: {
    variantId?: string | null;
    alt?: string | null;
    isPrimary?: string | null;
  },
) => {
  const formData = new FormData();
  formData.append('file', file);
  if (options?.variantId) formData.append('variantId', options.variantId);
  if (options?.alt) formData.append('alt', options.alt);
  if (options?.isPrimary) formData.append('isPrimary', options.isPrimary);

  return kyInstance
    .post(`product/${productId}/upload/image`, { body: formData })
    .json<IApiResponseWrapperType<IAdminProductImage>>();
};

// ============ Update Product Image (set primary, alt, sortOrder) ============
export const updateProductImageAPI = async (
  productId: string,
  imageId: string,
  data: IUpdateProductImagePayload,
) =>
  kyInstance
    .patch(`product/${productId}/images/${imageId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductImage>>();

// ============ Delete Product Image ============
export const deleteProductImageAPI = async (
  productId: string,
  imageId: string,
) =>
  kyInstance
    .delete(`product/${productId}/images/${imageId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

// ============ Reorder Product Images ============
export const reorderProductImagesAPI = async (
  productId: string,
  imageIds: string[],
) =>
  kyInstance
    .patch(`product/${productId}/images/reorder`, { json: { imageIds } })
    .json<IApiResponseWrapperType<IAdminProductImage[]>>();

// ============ Delete Product (Admin) ============
export const deleteAdminProductAPI = async (productId: string) =>
  kyInstance
    .delete(`product/${productId}`)
    .json<IApiResponseWrapperType<IAdminProductDataType>>();

// ============ Get Product Variants ============
export const getProductVariantsAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}/variants`)
    .json<IApiResponseWrapperType<IAdminProductVariant[]>>();

// ============ Add Product Variant ============
export const addProductVariantAPI = async (
  productId: string,
  data: ICreateProductVariantPayload,
) =>
  kyInstance
    .post(`product/${productId}/variants`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductVariant>>();

// ============ Update Product Variant ============
export const updateProductVariantAPI = async (
  productId: string,
  variantId: string,
  data: IUpdateProductVariantPayload,
) =>
  kyInstance
    .patch(`product/${productId}/variants/${variantId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductVariant>>();

// ============ Delete Product Variant ============
export const deleteProductVariantAPI = async (
  productId: string,
  variantId: string,
) =>
  kyInstance
    .delete(`product/${productId}/variants/${variantId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

// ============ Get Product Badges ============
export const getProductBadgesAPI = async (productId: string) =>
  kyInstance
    .get(`product/${productId}/badges`)
    .json<IApiResponseWrapperType<IAdminProductBadge[]>>();

// ============ Add Product Badge (single) ============
export const addProductBadgeAPI = async (
  productId: string,
  data: ICreateProductBadgePayload,
) =>
  kyInstance
    .post(`product/${productId}/badges`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductBadge>>();

// ============ Add Multiple Product Badges (bulk) ============
export const addMultipleProductBadgesAPI = async (
  productId: string,
  data: ICreateMultipleProductBadgesPayload,
) =>
  kyInstance
    .post(`product/${productId}/badges/bulk`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductBadge[]>>();

// ============ Update Product Badge ============
export const updateProductBadgeAPI = async (
  productId: string,
  badgeId: string,
  data: IUpdateProductBadgePayload,
) =>
  kyInstance
    .patch(`product/${productId}/badges/${badgeId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminProductBadge>>();

// ============ Delete Product Badge ============
export const deleteProductBadgeAPI = async (
  productId: string,
  badgeId: string,
) =>
  kyInstance
    .delete(`product/${productId}/badges/${badgeId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();
