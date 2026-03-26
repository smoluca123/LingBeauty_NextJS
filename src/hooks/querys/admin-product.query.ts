import { useQuery } from '@tanstack/react-query'
import {
  getAllAdminProductsClientAPI,
  getProductImagesClientAPI,
  getProductVariantsClientAPI,
  getProductBadgesClientAPI,
} from '@/lib/apis/client/admin-product.apis'
import type { IAdminProductFilters } from '@/lib/types/interfaces/apis/admin-product.interfaces'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminProductQueryKeys = {
  all: ['admin', 'products'] as const,
  list: (params: IAdminProductFilters) =>
    ['admin', 'products', 'list', params] as const,
}

// ── Get All Products (Admin) ──────────────────────────────────────────────────

export const useAdminProductsQuery = (params: IAdminProductFilters = {}) =>
  useQuery({
    queryKey: adminProductQueryKeys.list(params),
    queryFn: () => getAllAdminProductsClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev, // giữ data cũ khi đang fetch trang mới
  })

// ── Query Keys for Images ──────────────────────────────────────────────────────

export const productImageQueryKeys = {
  images: (productId: string) =>
    ['admin', 'products', productId, 'images'] as const,
}

// ── Get Product Images ─────────────────────────────────────────────────────────

export const useProductImagesQuery = (productId: string | null) =>
  useQuery({
    queryKey: productImageQueryKeys.images(productId ?? ''),
    queryFn: () => getProductImagesClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 30,
  })

// ── Query Keys for Variants ────────────────────────────────────────────────────

export const productVariantQueryKeys = {
  variants: (productId: string) =>
    ['admin', 'products', productId, 'variants'] as const,
}

// ── Get Product Variants ───────────────────────────────────────────────────────

export const useProductVariantsQuery = (productId: string | null) =>
  useQuery({
    queryKey: productVariantQueryKeys.variants(productId ?? ''),
    queryFn: () => getProductVariantsClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 30,
  })

// ── Query Keys for Variant Images ──────────────────────────────────────────────

export const variantImageQueryKeys = {
  images: (productId: string, variantId: string) =>
    ['admin', 'products', productId, 'variants', variantId, 'images'] as const,
}

// ── Get Variant Images (filter from product images) ───────────────────────────

export const useVariantImagesQuery = (
  productId: string | null,
  variantId: string | null,
) =>
  useQuery({
    queryKey: variantImageQueryKeys.images(productId ?? '', variantId ?? ''),
    queryFn: async () => {
      const res = await getProductImagesClientAPI(productId!)
      const data = res && 'data' in res ? res.data : []
      return {
        ...(res as object),
        data: (data ?? []).filter((img) => img.variantId === variantId),
      }
    },
    enabled: !!productId && !!variantId,
    staleTime: 1000 * 30,
  })

// ── Query Keys for Badges ──────────────────────────────────────────────────────

export const productBadgeQueryKeys = {
  badges: (productId: string) =>
    ['admin', 'products', productId, 'badges'] as const,
}

// ── Get Product Badges ─────────────────────────────────────────────────────────

export const useProductBadgesQuery = (productId: string | null) =>
  useQuery({
    queryKey: productBadgeQueryKeys.badges(productId ?? ''),
    queryFn: () => getProductBadgesClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60, // 60s - badges ít thay đổi
  })
