import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IInventoryOverview,
  IInventoryProductItem,
  IInventoryVariantItem,
  IUpdateInventoryPayload,
  IAdjustInventoryPayload,
  IBulkAdjustInventoryPayload,
} from '@/lib/types/interfaces/apis/admin-inventory.interfaces'

// ── Overview ──────────────────────────────────────────────────────────────────

/**
 * Get inventory overview statistics
 * @returns Inventory overview data
 * @throws Error with backend message if request fails
 */
export const getInventoryOverviewClientAPI = async (): Promise<
  IApiResponseWrapperType<IInventoryOverview>
> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/overview')
      .json<IApiResponseWrapperType<IInventoryOverview>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch inventory overview'),
    )
  }
}

// ── All Products / Variants ─────────────────────────────────────────────────────────────────

/**
 * Get all products inventory with pagination and filtering
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @param search - Optional search query
 * @param status - Optional status filter
 * @returns Paginated product inventory list
 * @throws Error with backend message if request fails
 */
export const getAllProductsClientAPI = async (
  page = 1,
  limit = 20,
  search?: string,
  status?: string,
): Promise<IApiPaginationResponseWrapperType<IInventoryProductItem>> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/all/products', {
        searchParams: {
          page: String(page),
          limit: String(limit),
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
        },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch products'),
    )
  }
}

/**
 * Get all variants inventory with pagination and filtering
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @param search - Optional search query
 * @param status - Optional status filter
 * @returns Paginated variant inventory list
 * @throws Error with backend message if request fails
 */
export const getAllVariantsClientAPI = async (
  page = 1,
  limit = 20,
  search?: string,
  status?: string,
): Promise<IApiPaginationResponseWrapperType<IInventoryVariantItem>> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/all/variants', {
        searchParams: {
          page: String(page),
          limit: String(limit),
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
        },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch variants'),
    )
  }
}

// ── Low Stock ─────────────────────────────────────────────────────────────────

/**
 * Get low stock products
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @returns Paginated low stock products list
 * @throws Error with backend message if request fails
 */
export const getLowStockProductsClientAPI = async (
  page = 1,
  limit = 20,
): Promise<IApiPaginationResponseWrapperType<IInventoryProductItem>> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/low-stock/products', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch low stock products'),
    )
  }
}

/**
 * Get low stock variants
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @returns Paginated low stock variants list
 * @throws Error with backend message if request fails
 */
export const getLowStockVariantsClientAPI = async (
  page = 1,
  limit = 20,
): Promise<IApiPaginationResponseWrapperType<IInventoryVariantItem>> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/low-stock/variants', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch low stock variants'),
    )
  }
}

// ── Out of Stock ──────────────────────────────────────────────────────────────

/**
 * Get out of stock products
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @returns Paginated out of stock products list
 * @throws Error with backend message if request fails
 */
export const getOutOfStockProductsClientAPI = async (
  page = 1,
  limit = 20,
): Promise<IApiPaginationResponseWrapperType<IInventoryProductItem>> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/out-of-stock/products', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch out of stock products'),
    )
  }
}

/**
 * Get out of stock variants
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @returns Paginated out of stock variants list
 * @throws Error with backend message if request fails
 */
export const getOutOfStockVariantsClientAPI = async (
  page = 1,
  limit = 20,
): Promise<IApiPaginationResponseWrapperType<IInventoryVariantItem>> => {
  try {
    return await kyNextInstance
      .get('admin/inventory/out-of-stock/variants', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch out of stock variants'),
    )
  }
}

// ── Bulk Adjust ───────────────────────────────────────────────────────────────

/**
 * Bulk adjust inventory for multiple items
 * @param payload - Bulk adjust payload containing items to adjust
 * @returns Updated inventory items
 * @throws Error with backend message if request fails
 */
export const bulkAdjustInventoryClientAPI = async (
  payload: IBulkAdjustInventoryPayload,
): Promise<IApiResponseWrapperType<IInventoryProductItem[]>> => {
  try {
    return await kyNextInstance
      .post('admin/inventory/bulk-adjust', { json: payload })
      .json<IApiResponseWrapperType<IInventoryProductItem[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to bulk adjust inventory'),
    )
  }
}

// ── Product-level ─────────────────────────────────────────────────────────────

/**
 * Update product inventory
 * @param productId - Product ID
 * @param payload - Update payload
 * @returns Updated product inventory
 * @throws Error with backend message if request fails
 */
export const updateProductInventoryClientAPI = async (
  productId: string,
  payload: IUpdateInventoryPayload,
): Promise<IApiResponseWrapperType<IInventoryProductItem>> => {
  try {
    return await kyNextInstance
      .patch(`admin/inventory/product/${productId}`, { json: payload })
      .json<IApiResponseWrapperType<IInventoryProductItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update product inventory'),
    )
  }
}

/**
 * Adjust product inventory (add/subtract quantity)
 * @param productId - Product ID
 * @param payload - Adjust payload
 * @returns Updated product inventory
 * @throws Error with backend message if request fails
 */
export const adjustProductInventoryClientAPI = async (
  productId: string,
  payload: IAdjustInventoryPayload,
): Promise<IApiResponseWrapperType<IInventoryProductItem>> => {
  try {
    return await kyNextInstance
      .post(`admin/inventory/product/${productId}/adjust`, { json: payload })
      .json<IApiResponseWrapperType<IInventoryProductItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to adjust product inventory'),
    )
  }
}

// ── Variant-level ─────────────────────────────────────────────────────────────

/**
 * Update variant inventory
 * @param productId - Product ID
 * @param variantId - Variant ID
 * @param payload - Update payload
 * @returns Updated variant inventory
 * @throws Error with backend message if request fails
 */
export const updateVariantInventoryClientAPI = async (
  productId: string,
  variantId: string,
  payload: IUpdateInventoryPayload,
): Promise<IApiResponseWrapperType<IInventoryVariantItem>> => {
  try {
    return await kyNextInstance
      .patch(`admin/inventory/product/${productId}/variant/${variantId}`, {
        json: payload,
      })
      .json<IApiResponseWrapperType<IInventoryVariantItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update variant inventory'),
    )
  }
}

/**
 * Adjust variant inventory (add/subtract quantity)
 * @param productId - Product ID
 * @param variantId - Variant ID
 * @param payload - Adjust payload
 * @returns Updated variant inventory
 * @throws Error with backend message if request fails
 */
export const adjustVariantInventoryClientAPI = async (
  productId: string,
  variantId: string,
  payload: IAdjustInventoryPayload,
): Promise<IApiResponseWrapperType<IInventoryVariantItem>> => {
  try {
    return await kyNextInstance
      .post(
        `admin/inventory/product/${productId}/variant/${variantId}/adjust`,
        { json: payload },
      )
      .json<IApiResponseWrapperType<IInventoryVariantItem>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to adjust variant inventory'),
    )
  }
}
