import { useQuery } from '@tanstack/react-query'
import {
  getInventoryOverviewClientAPI,
  getAllProductsClientAPI,
  getAllVariantsClientAPI,
  getLowStockProductsClientAPI,
  getLowStockVariantsClientAPI,
  getOutOfStockProductsClientAPI,
  getOutOfStockVariantsClientAPI,
} from '@/lib/apis/client/admin-inventory.apis'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const inventoryQueryKeys = {
  all: ['admin', 'inventory'] as const,
  overview: ['admin', 'inventory', 'overview'] as const,
  allProducts: (
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ) =>
    [
      'admin',
      'inventory',
      'all',
      'products',
      page,
      limit,
      search,
      status,
    ] as const,
  allVariants: (
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ) =>
    [
      'admin',
      'inventory',
      'all',
      'variants',
      page,
      limit,
      search,
      status,
    ] as const,
  lowStockProducts: (page: number, limit: number) =>
    ['admin', 'inventory', 'low-stock', 'products', page, limit] as const,
  lowStockVariants: (page: number, limit: number) =>
    ['admin', 'inventory', 'low-stock', 'variants', page, limit] as const,
  outOfStockProducts: (page: number, limit: number) =>
    ['admin', 'inventory', 'out-of-stock', 'products', page, limit] as const,
  outOfStockVariants: (page: number, limit: number) =>
    ['admin', 'inventory', 'out-of-stock', 'variants', page, limit] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useInventoryOverviewQuery = () =>
  useQuery({
    queryKey: inventoryQueryKeys.overview,
    queryFn: () => getInventoryOverviewClientAPI(),
    staleTime: 1000 * 60, // 1 phút
  })

export const useAllProductsQuery = (
  page = 1,
  limit = 20,
  search?: string,
  status?: string,
) =>
  useQuery({
    queryKey: inventoryQueryKeys.allProducts(page, limit, search, status),
    queryFn: () => getAllProductsClientAPI(page, limit, search, status),
    staleTime: 1000 * 60,
  })

export const useAllVariantsQuery = (
  page = 1,
  limit = 20,
  search?: string,
  status?: string,
) =>
  useQuery({
    queryKey: inventoryQueryKeys.allVariants(page, limit, search, status),
    queryFn: () => getAllVariantsClientAPI(page, limit, search, status),
    staleTime: 1000 * 60,
  })

export const useLowStockProductsQuery = (page = 1, limit = 20) =>
  useQuery({
    queryKey: inventoryQueryKeys.lowStockProducts(page, limit),
    queryFn: () => getLowStockProductsClientAPI(page, limit),
    staleTime: 1000 * 60,
  })

export const useLowStockVariantsQuery = (page = 1, limit = 20) =>
  useQuery({
    queryKey: inventoryQueryKeys.lowStockVariants(page, limit),
    queryFn: () => getLowStockVariantsClientAPI(page, limit),
    staleTime: 1000 * 60,
  })

export const useOutOfStockProductsQuery = (page = 1, limit = 20) =>
  useQuery({
    queryKey: inventoryQueryKeys.outOfStockProducts(page, limit),
    queryFn: () => getOutOfStockProductsClientAPI(page, limit),
    staleTime: 1000 * 60,
  })

export const useOutOfStockVariantsQuery = (page = 1, limit = 20) =>
  useQuery({
    queryKey: inventoryQueryKeys.outOfStockVariants(page, limit),
    queryFn: () => getOutOfStockVariantsClientAPI(page, limit),
    staleTime: 1000 * 60,
  })
