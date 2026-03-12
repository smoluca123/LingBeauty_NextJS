import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
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

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ============ Get All Products (Admin) ============
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
      .json<IApiPaginationResponseWrapperType<IAdminProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Create Product (Admin) ============
export const createProductClientAPI = async (data: ICreateProductPayload) => {
  try {
    return await kyNextInstance
      .post('admin/products', { json: data })
      .json<IApiResponseWrapperType<IAdminProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update Product (Admin) ============
export const updateProductClientAPI = async (
  productId: string,
  data: IUpdateProductPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Product Images ============
export const getProductImagesClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/products/${productId}/images`)
      .json<IApiResponseWrapperType<IAdminProductImage[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Upload Product Image (multipart) ============
export const uploadProductImageClientAPI = async (
  productId: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/upload/image`, { body: formData })
      .json<IApiResponseWrapperType<IAdminProductImage>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update Product Image (set primary, alt, sortOrder) ============
export const updateProductImageClientAPI = async (
  productId: string,
  imageId: string,
  data: IUpdateProductImagePayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/images/${imageId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductImage>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Product Image ============
export const deleteProductImageClientAPI = async (
  productId: string,
  imageId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}/images/${imageId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Reorder Product Images ============
export const reorderProductImagesClientAPI = async (
  productId: string,
  imageIds: string[],
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/images/reorder`, {
        json: { imageIds },
      })
      .json<IApiResponseWrapperType<IAdminProductImage[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Product (Admin) ============
export const deleteProductClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}`)
      .json<IApiResponseWrapperType<IAdminProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Product Variants ============
export const getProductVariantsClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/products/${productId}/variants`)
      .json<IApiResponseWrapperType<IAdminProductVariant[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Add Product Variant ============
export const addProductVariantClientAPI = async (
  productId: string,
  data: ICreateProductVariantPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/variants`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductVariant>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update Product Variant ============
export const updateProductVariantClientAPI = async (
  productId: string,
  variantId: string,
  data: IUpdateProductVariantPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/variants/${variantId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductVariant>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Product Variant ============
export const deleteProductVariantClientAPI = async (
  productId: string,
  variantId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}/variants/${variantId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Product Badges ============
export const getProductBadgesClientAPI = async (productId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/products/${productId}/badges`)
      .json<IApiResponseWrapperType<IAdminProductBadge[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Add Product Badge (single) ============
export const addProductBadgeClientAPI = async (
  productId: string,
  data: ICreateProductBadgePayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/badges`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductBadge>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Add Multiple Product Badges (bulk) ============
export const addMultipleProductBadgesClientAPI = async (
  productId: string,
  data: ICreateMultipleProductBadgesPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/products/${productId}/badges/bulk`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductBadge[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update Product Badge ============
export const updateProductBadgeClientAPI = async (
  productId: string,
  badgeId: string,
  data: IUpdateProductBadgePayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/products/${productId}/badges/${badgeId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminProductBadge>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Product Badge ============
export const deleteProductBadgeClientAPI = async (
  productId: string,
  badgeId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/products/${productId}/badges/${badgeId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};
