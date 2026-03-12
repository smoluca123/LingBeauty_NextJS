import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type { IApiResponseWrapperType, IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IInventoryOverview,
  IInventoryProductItem,
  IInventoryVariantItem,
  IUpdateInventoryPayload,
  IAdjustInventoryPayload,
  IBulkAdjustInventoryPayload,
} from '@/lib/types/interfaces/apis/admin-inventory.interfaces';

const handleError = async (error: unknown): Promise<never> => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ── Overview ──────────────────────────────────────────────────────────────────

export const getInventoryOverviewClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/inventory/overview')
      .json<IApiResponseWrapperType<IInventoryOverview>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── All Products / Variants ─────────────────────────────────────────────────────────────────

export const getAllProductsClientAPI = async (page = 1, limit = 20, search?: string, status?: string) => {
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
      .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>();
  } catch (error) {
    return handleError(error);
  }
};

export const getAllVariantsClientAPI = async (page = 1, limit = 20, search?: string, status?: string) => {
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
      .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Low Stock ─────────────────────────────────────────────────────────────────

export const getLowStockProductsClientAPI = async (page = 1, limit = 20) => {
  try {
    return await kyNextInstance
      .get('admin/inventory/low-stock/products', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>();
  } catch (error) {
    return handleError(error);
  }
};

export const getLowStockVariantsClientAPI = async (page = 1, limit = 20) => {
  try {
    return await kyNextInstance
      .get('admin/inventory/low-stock/variants', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Out of Stock ──────────────────────────────────────────────────────────────

export const getOutOfStockProductsClientAPI = async (page = 1, limit = 20) => {
  try {
    return await kyNextInstance
      .get('admin/inventory/out-of-stock/products', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>();
  } catch (error) {
    return handleError(error);
  }
};

export const getOutOfStockVariantsClientAPI = async (page = 1, limit = 20) => {
  try {
    return await kyNextInstance
      .get('admin/inventory/out-of-stock/variants', {
        searchParams: { page: String(page), limit: String(limit) },
      })
      .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Bulk Adjust ───────────────────────────────────────────────────────────────

export const bulkAdjustInventoryClientAPI = async (payload: IBulkAdjustInventoryPayload) => {
  try {
    return await kyNextInstance
      .post('admin/inventory/bulk-adjust', { json: payload })
      .json<IApiResponseWrapperType<IInventoryProductItem[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Product-level ─────────────────────────────────────────────────────────────

export const updateProductInventoryClientAPI = async (
  productId: string,
  payload: IUpdateInventoryPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/inventory/product/${productId}`, { json: payload })
      .json<IApiResponseWrapperType<IInventoryProductItem>>();
  } catch (error) {
    return handleError(error);
  }
};

export const adjustProductInventoryClientAPI = async (
  productId: string,
  payload: IAdjustInventoryPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/inventory/product/${productId}/adjust`, { json: payload })
      .json<IApiResponseWrapperType<IInventoryProductItem>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Variant-level ─────────────────────────────────────────────────────────────

export const updateVariantInventoryClientAPI = async (
  productId: string,
  variantId: string,
  payload: IUpdateInventoryPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/inventory/product/${productId}/variant/${variantId}`, { json: payload })
      .json<IApiResponseWrapperType<IInventoryVariantItem>>();
  } catch (error) {
    return handleError(error);
  }
};

export const adjustVariantInventoryClientAPI = async (
  productId: string,
  variantId: string,
  payload: IAdjustInventoryPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/inventory/product/${productId}/variant/${variantId}/adjust`, { json: payload })
      .json<IApiResponseWrapperType<IInventoryVariantItem>>();
  } catch (error) {
    return handleError(error);
  }
};
