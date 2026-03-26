import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
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

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Get all flash sales with pagination and filtering (Admin - requires JWT auth)
 * @param params - Filter and pagination parameters
 * @returns Paginated flash sale list
 * @throws Error with backend message if request fails
 */
export const getAllFlashSalesAPI = async (
  params: IFlashSaleFilterParams = {},
) =>
  kyInstance
    .get('flash-sales', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search,
        status: params.status,
        isActive: params.isActive,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IFlashSaleDataType>>()

/**
 * Get flash sale by ID (Admin - requires JWT auth)
 * @param id - Flash sale ID
 * @returns Flash sale data
 * @throws Error with backend message if request fails
 */
export const getFlashSaleByIdAPI = async (id: string) =>
  kyInstance
    .get(`flash-sales/${id}`)
    .json<IApiResponseWrapperType<IFlashSaleDataType>>()

/**
 * Create new flash sale (Admin - requires JWT auth)
 * @param data - Flash sale data to create
 * @returns Created flash sale data
 * @throws Error with backend message if request fails
 */
export const createFlashSaleAPI = async (data: ICreateFlashSaleFormData) =>
  kyInstance
    .post('flash-sales', { json: data })
    .json<IApiResponseWrapperType<IFlashSaleDataType>>()

/**
 * Update flash sale (Admin - requires JWT auth)
 * @param id - Flash sale ID to update
 * @param data - Flash sale data to update
 * @returns Updated flash sale data
 * @throws Error with backend message if request fails
 */
export const updateFlashSaleAPI = async (
  id: string,
  data: IUpdateFlashSaleFormData,
) =>
  kyInstance
    .put(`flash-sales/${id}`, { json: data })
    .json<IApiResponseWrapperType<IFlashSaleDataType>>()

/**
 * Delete flash sale (Admin - requires JWT auth)
 * @param id - Flash sale ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteFlashSaleAPI = async (id: string) =>
  kyInstance
    .delete(`flash-sales/${id}`)
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Add products to flash sale (Admin - requires JWT auth)
 * @param flashSaleId - Flash sale ID to add products to
 * @param data - Array of product data to add
 * @returns Array of added flash sale products
 * @throws Error with backend message if request fails
 */
export const addProductsToFlashSaleAPI = async (
  flashSaleId: string,
  data: IAddFlashSaleProductFormData[],
) =>
  kyInstance
    .post(`flash-sales/${flashSaleId}/products`, { json: data })
    .json<IApiResponseWrapperType<IFlashSaleProductDataType[]>>()

/**
 * Update flash sale product (Admin - requires JWT auth)
 * @param flashSaleId - Flash sale ID
 * @param productId - Product ID to update
 * @param data - Product data to update
 * @param variantId - Optional variant ID
 * @returns Updated flash sale product data
 * @throws Error with backend message if request fails
 */
export const updateFlashSaleProductAPI = async (
  flashSaleId: string,
  productId: string,
  data: IUpdateFlashSaleProductFormData,
  variantId?: string,
) =>
  kyInstance
    .put(`flash-sales/${flashSaleId}/products/${productId}`, {
      json: data,
      searchParams: variantId ? { variantId } : undefined,
    })
    .json<IApiResponseWrapperType<IFlashSaleProductDataType>>()

/**
 * Remove product from flash sale (Admin - requires JWT auth)
 * @param flashSaleId - Flash sale ID
 * @param productId - Product ID to remove
 * @param variantId - Optional variant ID
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const removeProductFromFlashSaleAPI = async (
  flashSaleId: string,
  productId: string,
  variantId?: string,
) =>
  kyInstance
    .delete(`flash-sales/${flashSaleId}/products/${productId}`, {
      searchParams: variantId ? { variantId } : undefined,
    })
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Get current active flash sale (Public)
 * @returns Current active flash sale data or null
 * @throws Error with backend message if request fails
 */
export const getCurrentFlashSaleAPI = async () =>
  kyInstance
    .get('flash-sales/current')
    .json<IApiResponseWrapperType<IFlashSaleDataType | null>>()

/**
 * Get upcoming flash sales (Public)
 * @returns Array of upcoming flash sales
 * @throws Error with backend message if request fails
 */
export const getUpcomingFlashSalesAPI = async () =>
  kyInstance
    .get('flash-sales/upcoming')
    .json<IApiResponseWrapperType<IFlashSaleDataType[]>>()
