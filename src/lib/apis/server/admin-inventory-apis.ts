'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IInventoryOverview,
  IInventoryProductItem,
  IInventoryVariantItem,
  IInventoryItem,
  IUpdateInventoryPayload,
  IAdjustInventoryPayload,
  IBulkAdjustInventoryPayload,
} from '@/lib/types/interfaces/apis/admin-inventory.interfaces'

// Helper: remove undefined values before passing to searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

// ─── Overview & Reports ──────────────────────────────────────────────────

/**
 * Get inventory overview statistics
 * @returns Inventory overview data
 * @throws Error with backend message if request fails
 */
export const getInventoryOverviewAPI = async () =>
  kyInstance
    .get('inventory/overview')
    .json<IApiResponseWrapperType<IInventoryOverview>>()

/**
 * Get all products inventory with pagination and filtering
 * @param params - Query parameters (page, limit, search, status)
 * @returns Paginated product inventory list
 * @throws Error with backend message if request fails
 */
export const getAllProductsAPI = async (
  params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  } = {},
) =>
  kyInstance
    .get('inventory/all/products', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        search: params.search,
        status: params.status,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>()

/**
 * Get all variants inventory with pagination and filtering
 * @param params - Query parameters (page, limit, search, status)
 * @returns Paginated variant inventory list
 * @throws Error with backend message if request fails
 */
export const getAllVariantsAPI = async (
  params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  } = {},
) =>
  kyInstance
    .get('inventory/all/variants', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        search: params.search,
        status: params.status,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>()

/**
 * Get low stock products
 * @param page - Page number
 * @param limit - Items per page
 * @returns Paginated low stock products list
 * @throws Error with backend message if request fails
 */
export const getLowStockProductsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/low-stock/products', {
      searchParams: { page, limit },
    })
    .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>()

/**
 * Get low stock variants
 * @param page - Page number
 * @param limit - Items per page
 * @returns Paginated low stock variants list
 * @throws Error with backend message if request fails
 */
export const getLowStockVariantsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/low-stock/variants', {
      searchParams: { page, limit },
    })
    .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>()

/**
 * Get out of stock products
 * @param page - Page number
 * @param limit - Items per page
 * @returns Paginated out of stock products list
 * @throws Error with backend message if request fails
 */
export const getOutOfStockProductsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/out-of-stock/products', {
      searchParams: { page, limit },
    })
    .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>()

/**
 * Get out of stock variants
 * @param page - Page number
 * @param limit - Items per page
 * @returns Paginated out of stock variants list
 * @throws Error with backend message if request fails
 */
export const getOutOfStockVariantsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/out-of-stock/variants', {
      searchParams: { page, limit },
    })
    .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>()

/**
 * Bulk adjust inventory for multiple items
 * @param data - Bulk adjust payload
 * @returns Updated inventory items
 * @throws Error with backend message if request fails
 */
export const bulkAdjustInventoryAPI = async (
  data: IBulkAdjustInventoryPayload,
) =>
  kyInstance
    .post('inventory/bulk-adjust', { json: data })
    .json<IApiResponseWrapperType<IInventoryItem[]>>()

// ─── Product-Level Inventory ─────────────────────────────────────────────

/**
 * Get product inventory by product ID
 * @param productId - Product ID
 * @returns Product inventory data
 * @throws Error with backend message if request fails
 */
export const getProductInventoryAPI = async (productId: string) =>
  kyInstance
    .get(`inventory/product/${productId}`)
    .json<IApiResponseWrapperType<IInventoryItem>>()

/**
 * Update product inventory
 * @param productId - Product ID
 * @param data - Update payload
 * @returns Updated product inventory
 * @throws Error with backend message if request fails
 */
export const updateProductInventoryAPI = async (
  productId: string,
  data: IUpdateInventoryPayload,
) =>
  kyInstance
    .patch(`inventory/product/${productId}`, { json: data })
    .json<IApiResponseWrapperType<IInventoryItem>>()

/**
 * Adjust product inventory (add/subtract quantity)
 * @param productId - Product ID
 * @param data - Adjust payload
 * @returns Updated product inventory
 * @throws Error with backend message if request fails
 */
export const adjustProductInventoryAPI = async (
  productId: string,
  data: IAdjustInventoryPayload,
) =>
  kyInstance
    .post(`inventory/product/${productId}/adjust`, { json: data })
    .json<IApiResponseWrapperType<IInventoryItem>>()

// ─── Variant-Level Inventory ─────────────────────────────────────────────

/**
 * Get variant inventory by product ID and variant ID
 * @param productId - Product ID
 * @param variantId - Variant ID
 * @returns Variant inventory data
 * @throws Error with backend message if request fails
 */
export const getVariantInventoryAPI = async (
  productId: string,
  variantId: string,
) =>
  kyInstance
    .get(`inventory/product/${productId}/variant/${variantId}`)
    .json<IApiResponseWrapperType<IInventoryVariantItem>>()

/**
 * Update variant inventory
 * @param productId - Product ID
 * @param variantId - Variant ID
 * @param data - Update payload
 * @returns Updated variant inventory
 * @throws Error with backend message if request fails
 */
export const updateVariantInventoryAPI = async (
  productId: string,
  variantId: string,
  data: IUpdateInventoryPayload,
) =>
  kyInstance
    .patch(`inventory/product/${productId}/variant/${variantId}`, {
      json: data,
    })
    .json<IApiResponseWrapperType<IInventoryVariantItem>>()

/**
 * Adjust variant inventory (add/subtract quantity)
 * @param productId - Product ID
 * @param variantId - Variant ID
 * @param data - Adjust payload
 * @returns Updated variant inventory
 * @throws Error with backend message if request fails
 */
export const adjustVariantInventoryAPI = async (
  productId: string,
  variantId: string,
  data: IAdjustInventoryPayload,
) =>
  kyInstance
    .post(`inventory/product/${productId}/variant/${variantId}/adjust`, {
      json: data,
    })
    .json<IApiResponseWrapperType<IInventoryVariantItem>>()
