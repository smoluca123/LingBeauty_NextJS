'use server'
import { DEFAULT_CACHE_TIME } from '@/constants/cache'
import { publicKyInstance } from '@/lib/kyInstance/publicKy'
import type {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IFilterCategoryDataType,
  IProductDataType,
  IProductStatsDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'
import { cacheLife, cacheTag } from 'next/cache'

export interface IProductQueryParams extends IApiPaginationParams {
  search?: string
  categoryId?: string
  brandId?: string
  isFeatured?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'basePrice' | 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
}

/** Params for the filter-categories server API */
export interface IFilterCategoriesQueryParams {
  brandId?: string
  categoryId?: string
  search?: string
  isFeatured?: boolean
  minPrice?: number
  maxPrice?: number
}

/** Params for the product stats server API */
export interface IProductStatsQueryParams {
  brandId?: string
  categoryId?: string
  search?: string
  isFeatured?: boolean
}

// Helper: build search params object, omitting undefined values
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Get products with pagination and filtering
 * @param options - Query parameters for filtering and pagination
 * @returns Paginated product list
 * @throws Error with backend message if request fails
 */
export const getProductsAPI = async (
  options: IProductQueryParams = { page: 1, limit: 10 },
) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('products')
  return publicKyInstance
    .get('product', {
      searchParams: buildSearchParams({
        page: options.page,
        limit: options.limit,
        search: options.search,
        categoryId: options.categoryId,
        brandId: options.brandId,
        isFeatured: options.isFeatured,
        minPrice: options.minPrice,
        maxPrice: options.maxPrice,
        sortBy: options.sortBy,
        order: options.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IProductDataType>>()
}

/**
 * Get a single product by slug
 * @param slug - Product slug
 * @returns Single product data
 * @throws Error with backend message if request fails
 */
export const getProductBySlugAPI = async (slug: string) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('products', `product-${slug}`)
  return publicKyInstance
    .get(`product/slug/${slug}`)
    .json<IApiResponseWrapperType<IProductDataType>>()
}

/**
 * Fetch filter categories from the NestJS public endpoint.
 * Returns distinct categories with product counts for filter sidebar.
 * @param options - Filter parameters
 * @returns Array of filter categories with product counts
 * @throws Error with backend message if request fails
 */
export const getFilterCategoriesAPI = async (
  options: IFilterCategoriesQueryParams = {},
) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('filter-categories')
  return publicKyInstance
    .get('product/public/filter-categories', {
      searchParams: buildSearchParams({
        brandId: options.brandId,
        categoryId: options.categoryId,
        search: options.search,
        isFeatured: options.isFeatured,
        minPrice: options.minPrice,
        maxPrice: options.maxPrice,
      }),
    })
    .json<IApiResponseWrapperType<IFilterCategoryDataType[]>>()
}

/**
 * Fetch lightweight product stats (productCount + totalSold).
 * Uses aggregate queries on the backend — much cheaper than fetching all products.
 * @param options - Filter parameters
 * @returns Product statistics data
 * @throws Error with backend message if request fails
 */
export const getProductStatsAPI = async (
  options: IProductStatsQueryParams = {},
) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('product-stats')
  return publicKyInstance
    .get('product/public/stats', {
      searchParams: buildSearchParams({
        brandId: options.brandId,
        categoryId: options.categoryId,
        search: options.search,
        isFeatured: options.isFeatured,
      }),
    })
    .json<IApiResponseWrapperType<IProductStatsDataType>>()
}

/**
 * Fetch products from the same brand (Server Component).
 * Excludes the current product by filtering client-side after fetch.
 * @param brandId - Brand ID to filter by
 * @param excludeSlug - Optional product slug to exclude
 * @param limit - Maximum number of products to return
 * @returns Paginated product list from the same brand
 * @throws Error with backend message if request fails
 */
export const getProductsByBrandAPI = async (
  brandId: string,
  excludeSlug?: string,
  limit = 8,
) => {
  // "use cache";
  // cacheLife(DEFAULT_CACHE_TIME);
  // cacheTag(`products-brand-${brandId}`);
  const response = await publicKyInstance
    .get('product', {
      searchParams: buildSearchParams({ brandId, limit }),
    })
    .json<IApiPaginationResponseWrapperType<IProductDataType>>()

  // Exclude current product from the list
  if (excludeSlug && response?.data?.items) {
    response.data.items = response.data.items.filter(
      (p: IProductDataType) => p.slug !== excludeSlug,
    )
  }
  return response
}

/**
 * Fetch other/related products (Server Component).
 * Excludes current product and optionally filters by categoryId.
 * @param categoryId - Category ID to filter by
 * @param excludeSlug - Optional product slug to exclude
 * @param limit - Maximum number of products to return
 * @returns Paginated product list from the same category
 * @throws Error with backend message if request fails
 */
export const getRelatedProductsAPI = async (
  categoryId: string,
  excludeSlug?: string,
  limit = 8,
) => {
  // "use cache";
  // cacheLife(DEFAULT_CACHE_TIME);
  // cacheTag(`products-category-${categoryId}`);
  const response = await publicKyInstance
    .get('product', {
      searchParams: buildSearchParams({ categoryId, limit }),
    })
    .json<IApiPaginationResponseWrapperType<IProductDataType>>()

  // Exclude current product from the list
  if (excludeSlug && response?.data?.items) {
    response.data.items = response.data.items.filter(
      (p: IProductDataType) => p.slug !== excludeSlug,
    )
  }
  return response
}
