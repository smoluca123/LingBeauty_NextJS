import { useQuery } from '@tanstack/react-query'
import {
  getAllAdminCategoriesClientAPI,
  getAllAdminBrandsClientAPI,
} from '@/lib/apis/client/admin-category-brand.apis'
import { getAllAdminBrandsPagedClientAPI } from '@/lib/apis/client/admin-brand.apis'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminCategoryBrandQueryKeys = {
  categories: ['admin', 'categories'] as const,
  brands: ['admin', 'brands'] as const,
}

// ── Get All Categories (Admin – for dropdowns) ───────────────────────────────

export const useAdminCategoriesQuery = () =>
  useQuery({
    queryKey: adminCategoryBrandQueryKeys.categories,
    queryFn: () => getAllAdminCategoriesClientAPI(),
    staleTime: 1000 * 60 * 5, // 5 phút – categories ít thay đổi
  })

// ── Get All Brands (Admin – for dropdowns) ───────────────────────────────────

export const useAdminBrandsQuery = () =>
  useQuery({
    queryKey: adminCategoryBrandQueryKeys.brands,
    queryFn: () => getAllAdminBrandsClientAPI(),
    staleTime: 1000 * 60 * 5, // 5 phút – brands ít thay đổi
  })

// ── Get All Brands Paged (Admin – for brands table) ──────────────────────────

export const useAdminBrandsPagedQuery = (params?: {
  page?: number
  limit?: number
  search?: string
  order?: 'asc' | 'desc'
}) =>
  useQuery({
    queryKey: [...adminCategoryBrandQueryKeys.brands, params],
    queryFn: () => getAllAdminBrandsPagedClientAPI(params),
    staleTime: 1000 * 60 * 2,
  })
