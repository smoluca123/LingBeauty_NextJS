import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IFlashSaleDataType,
  IFlashSaleFilterParams,
  ICreateFlashSaleFormData,
  IUpdateFlashSaleFormData,
  IAddFlashSaleProductFormData,
  IUpdateFlashSaleProductFormData,
  IFlashSaleProductDataType,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces';

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

/**
 * Get all flash sales with pagination and filtering
 * Calls: GET /api/admin/flash-sales
 */
export const getAllFlashSalesClientAPI = async (
  params?: IFlashSaleFilterParams,
) => {
  try {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = String(params.page);
    if (params?.limit) searchParams.limit = String(params.limit);
    if (params?.search) searchParams.search = params.search;
    if (params?.status) searchParams.status = params.status;
    if (params?.isActive !== undefined)
      searchParams.isActive = String(params.isActive);
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    return await kyNextInstance
      .get('admin/flash-sales', { searchParams })
      .json<IApiPaginationResponseWrapperType<IFlashSaleDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get flash sale by ID
 * Calls: GET /api/admin/flash-sales/:id
 */
export const getFlashSaleByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/flash-sales/${id}`)
      .json<IApiResponseWrapperType<IFlashSaleDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create new flash sale
 * Calls: POST /api/admin/flash-sales
 */
export const createFlashSaleClientAPI = async (
  data: ICreateFlashSaleFormData,
) => {
  try {
    return await kyNextInstance
      .post('admin/flash-sales', { json: data })
      .json<IApiResponseWrapperType<IFlashSaleDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update flash sale
 * Calls: PUT /api/admin/flash-sales/:id
 */
export const updateFlashSaleClientAPI = async (
  id: string,
  data: IUpdateFlashSaleFormData,
) => {
  try {
    return await kyNextInstance
      .put(`admin/flash-sales/${id}`, { json: data })
      .json<IApiResponseWrapperType<IFlashSaleDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete flash sale
 * Calls: DELETE /api/admin/flash-sales/:id
 */
export const deleteFlashSaleClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/flash-sales/${id}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Add products to flash sale
 * Calls: POST /api/admin/flash-sales/:id/products
 */
export const addProductsToFlashSaleClientAPI = async (
  flashSaleId: string,
  data: IAddFlashSaleProductFormData[],
) => {
  try {
    return await kyNextInstance
      .post(`admin/flash-sales/${flashSaleId}/products`, { json: data })
      .json<IApiResponseWrapperType<IFlashSaleProductDataType[]>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update flash sale product
 * Calls: PUT /api/admin/flash-sales/:id/products/:productId
 */
export const updateFlashSaleProductClientAPI = async (
  flashSaleId: string,
  productId: string,
  data: IUpdateFlashSaleProductFormData,
  variantId?: string,
) => {
  try {
    const searchParams: Record<string, string> = {};
    if (variantId) searchParams.variantId = variantId;

    return await kyNextInstance
      .put(`admin/flash-sales/${flashSaleId}/products/${productId}`, {
        json: data,
        searchParams,
      })
      .json<IApiResponseWrapperType<IFlashSaleProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Remove product from flash sale
 * Calls: DELETE /api/admin/flash-sales/:id/products/:productId
 */
export const removeProductFromFlashSaleClientAPI = async (
  flashSaleId: string,
  productId: string,
  variantId?: string,
) => {
  try {
    const searchParams: Record<string, string> = {};
    if (variantId) searchParams.variantId = variantId;

    return await kyNextInstance
      .delete(`admin/flash-sales/${flashSaleId}/products/${productId}`, {
        searchParams,
      })
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get current active flash sale (public)
 * Calls: GET /api/flash-sales/current
 */
export const getCurrentFlashSaleClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('flash-sales/current')
      .json<IApiResponseWrapperType<IFlashSaleDataType | null>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get upcoming flash sales (public)
 * Calls: GET /api/flash-sales/upcoming
 */
export const getUpcomingFlashSalesClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('flash-sales/upcoming')
      .json<IApiResponseWrapperType<IFlashSaleDataType[]>>();
  } catch (error) {
    return handleError(error);
  }
};
