'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType, IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IInventoryOverview,
  IInventoryProductItem,
  IInventoryVariantItem,
  IUpdateInventoryPayload,
  IAdjustInventoryPayload,
  IBulkAdjustInventoryPayload,
} from '@/lib/types/interfaces/apis/admin-inventory.interfaces';

// ── Overview ──────────────────────────────────────────────────────────────────

export const getInventoryOverviewAPI = async () =>
  kyInstance
    .get('inventory/overview')
    .json<IApiResponseWrapperType<IInventoryOverview>>();

// ── All Products / Variants ──────────────────────────────────────────────────

export const getAllProductsAPI = async (page = 1, limit = 20, search?: string, status?: string) =>
  kyInstance
    .get('inventory/all/products', {
      searchParams: {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      },
    })
    .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>();

export const getAllVariantsAPI = async (page = 1, limit = 20, search?: string, status?: string) =>
  kyInstance
    .get('inventory/all/variants', {
      searchParams: {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      },
    })
    .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>();

// ── Low Stock ─────────────────────────────────────────────────────────────────

export const getLowStockProductsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/low-stock/products', { searchParams: { page, limit } })
    .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>();

export const getLowStockVariantsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/low-stock/variants', { searchParams: { page, limit } })
    .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>();

// ── Out of Stock ──────────────────────────────────────────────────────────────

export const getOutOfStockProductsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/out-of-stock/products', { searchParams: { page, limit } })
    .json<IApiPaginationResponseWrapperType<IInventoryProductItem>>();

export const getOutOfStockVariantsAPI = async (page = 1, limit = 20) =>
  kyInstance
    .get('inventory/out-of-stock/variants', { searchParams: { page, limit } })
    .json<IApiPaginationResponseWrapperType<IInventoryVariantItem>>();

// ── Bulk Adjust ───────────────────────────────────────────────────────────────

export const bulkAdjustInventoryAPI = async (payload: IBulkAdjustInventoryPayload) =>
  kyInstance
    .post('inventory/bulk-adjust', { json: payload })
    .json<IApiResponseWrapperType<IInventoryProductItem[]>>();

// ── Product-level ─────────────────────────────────────────────────────────────

export const updateProductInventoryAPI = async (
  productId: string,
  payload: IUpdateInventoryPayload,
) =>
  kyInstance
    .patch(`inventory/product/${productId}`, { json: payload })
    .json<IApiResponseWrapperType<IInventoryProductItem>>();

export const adjustProductInventoryAPI = async (
  productId: string,
  payload: IAdjustInventoryPayload,
) =>
  kyInstance
    .post(`inventory/product/${productId}/adjust`, { json: payload })
    .json<IApiResponseWrapperType<IInventoryProductItem>>();

// ── Variant-level ─────────────────────────────────────────────────────────────

export const updateVariantInventoryAPI = async (
  productId: string,
  variantId: string,
  payload: IUpdateInventoryPayload,
) =>
  kyInstance
    .patch(`inventory/product/${productId}/variant/${variantId}`, { json: payload })
    .json<IApiResponseWrapperType<IInventoryVariantItem>>();

export const adjustVariantInventoryAPI = async (
  productId: string,
  variantId: string,
  payload: IAdjustInventoryPayload,
) =>
  kyInstance
    .post(`inventory/product/${productId}/variant/${variantId}/adjust`, { json: payload })
    .json<IApiResponseWrapperType<IInventoryVariantItem>>();
