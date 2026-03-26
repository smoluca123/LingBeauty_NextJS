import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IFlashSaleDataType,
  IFlashSaleFilterParams,
  ICreateFlashSaleFormData,
  IUpdateFlashSaleFormData,
  IAddFlashSaleProductFormData,
  IUpdateFlashSaleProductFormData,
  IFlashSaleProductDataType,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces'

/**
 * Get all flash sales with pagination and filtering
 * @param params - Filter parameters for flash sales
 * @returns Promise with paginated flash sale data
 * @throws Error with backend message
 */
export const getAllFlashSalesClientAPI = async (
  params?: IFlashSaleFilterParams,
) => {
  try {
    const searchParams: Record<string, string> = {}
    if (params?.page) searchParams.page = String(params.page)
    if (params?.limit) searchParams.limit = String(params.limit)
    if (params?.search) searchParams.search = params.search
    if (params?.status) searchParams.status = params.status
    if (params?.isActive !== undefined)
      searchParams.isActive = String(params.isActive)
    if (params?.sortBy) searchParams.sortBy = params.sortBy
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder

    return await kyNextInstance
      .get('admin/flash-sales', { searchParams })
      .json<IApiPaginationResponseWrapperType<IFlashSaleDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch flash sales'),
    )
  }
}

/**
 * Get flash sale by ID
 * @param id - Flash sale ID
 * @returns Promise with flash sale data
 * @throws Error with backend message
 */
export const getFlashSaleByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/flash-sales/${id}`)
      .json<IApiResponseWrapperType<IFlashSaleDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch flash sale'),
    )
  }
}

/**
 * Create new flash sale
 * @param data - Flash sale creation data
 * @returns Promise with created flash sale data
 * @throws Error with backend message
 */
export const createFlashSaleClientAPI = async (
  data: ICreateFlashSaleFormData,
) => {
  try {
    return await kyNextInstance
      .post('admin/flash-sales', { json: data })
      .json<IApiResponseWrapperType<IFlashSaleDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create flash sale'),
    )
  }
}

/**
 * Update flash sale
 * @param id - Flash sale ID to update
 * @param data - Flash sale update data
 * @returns Promise with updated flash sale data
 * @throws Error with backend message
 */
export const updateFlashSaleClientAPI = async (
  id: string,
  data: IUpdateFlashSaleFormData,
) => {
  try {
    return await kyNextInstance
      .put(`admin/flash-sales/${id}`, { json: data })
      .json<IApiResponseWrapperType<IFlashSaleDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update flash sale'),
    )
  }
}

/**
 * Delete flash sale
 * @param id - Flash sale ID to delete
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteFlashSaleClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/flash-sales/${id}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete flash sale'),
    )
  }
}

/**
 * Add products to flash sale
 * @param flashSaleId - Flash sale ID
 * @param data - Array of products to add with their flash sale details
 * @returns Promise with added flash sale products array
 * @throws Error with backend message
 */
export const addProductsToFlashSaleClientAPI = async (
  flashSaleId: string,
  data: IAddFlashSaleProductFormData[],
) => {
  try {
    return await kyNextInstance
      .post(`admin/flash-sales/${flashSaleId}/products`, { json: data })
      .json<IApiResponseWrapperType<IFlashSaleProductDataType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to add products to flash sale'),
    )
  }
}

/**
 * Update flash sale product
 * @param flashSaleId - Flash sale ID
 * @param productId - Product ID to update
 * @param data - Flash sale product update data
 * @param variantId - Optional variant ID
 * @returns Promise with updated flash sale product data
 * @throws Error with backend message
 */
export const updateFlashSaleProductClientAPI = async (
  flashSaleId: string,
  productId: string,
  data: IUpdateFlashSaleProductFormData,
  variantId?: string,
) => {
  try {
    const searchParams: Record<string, string> = {}
    if (variantId) searchParams.variantId = variantId

    return await kyNextInstance
      .put(`admin/flash-sales/${flashSaleId}/products/${productId}`, {
        json: data,
        searchParams,
      })
      .json<IApiResponseWrapperType<IFlashSaleProductDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update flash sale product'),
    )
  }
}

/**
 * Remove product from flash sale
 * @param flashSaleId - Flash sale ID
 * @param productId - Product ID to remove
 * @param variantId - Optional variant ID
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const removeProductFromFlashSaleClientAPI = async (
  flashSaleId: string,
  productId: string,
  variantId?: string,
) => {
  try {
    const searchParams: Record<string, string> = {}
    if (variantId) searchParams.variantId = variantId

    return await kyNextInstance
      .delete(`admin/flash-sales/${flashSaleId}/products/${productId}`, {
        searchParams,
      })
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(
        error,
        'Failed to remove product from flash sale',
      ),
    )
  }
}

/**
 * Get current active flash sale (public)
 * @returns Promise with current flash sale data or null
 * @throws Error with backend message
 */
export const getCurrentFlashSaleClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('flash-sales/current')
      .json<IApiResponseWrapperType<IFlashSaleDataType | null>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch current flash sale'),
    )
  }
}

/**
 * Get upcoming flash sales (public)
 * @returns Promise with upcoming flash sales array
 * @throws Error with backend message
 */
export const getUpcomingFlashSalesClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('flash-sales/upcoming')
      .json<IApiResponseWrapperType<IFlashSaleDataType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch upcoming flash sales'),
    )
  }
}
