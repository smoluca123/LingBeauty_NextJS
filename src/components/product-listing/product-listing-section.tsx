'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PRICE_RANGES, PRODUCTS_PER_PAGE } from './constants';
import { FilterSidebar, FilterState, FilterDrawer } from './filter';
import { getActiveFiltersCount } from './filter/filter-utils';
import { ProductsSection } from './products/products-section';
import {
  useProductListingQuery,
  useFilterCategoriesQuery,
} from '@/hooks/querys/product-listing.query';
import {
  IFilterCategoriesParams,
  IProductListingParams,
} from '@/lib/apis/client/product.apis';
import { IFilterCategoryDataType } from '@/lib/types/interfaces/apis/product.interfaces';

/** Context params that define what products to show (brand page, collection, hot, etc.) */
export interface ProductListingContextParams {
  brandId?: string;
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
}

interface ProductListingSectionProps {
  /** Context params used to scope both product listing and filter categories */
  contextParams?: ProductListingContextParams;
  /** Initial page from URL for SSR pagination (e.g. /products/2 → initialPage=2) */
  initialPage?: number;
  /** Base URL for URL-based pagination (e.g. '/products'). When set, pagination uses Link/router instead of state-only */
  pageBaseUrl?: string;
  className?: string;
}

/**
 * Reusable product listing component with server-side filtering, sorting, and pagination.
 * Automatically fetches both products and available filter categories based on contextParams.
 *
 * @example
 * // Brand page
 * <ProductListingSection contextParams={{ brandId: 'xxx' }} />
 *
 * // Hot products page
 * <ProductListingSection contextParams={{ isFeatured: true }} />
 *
 * // All products (no context)
 * <ProductListingSection />
 */
export function ProductListingSection({
  contextParams = {},
  initialPage = 1,
  pageBaseUrl,
  className,
}: ProductListingSectionProps) {
  const router = useRouter();
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priceRanges: [],
    categories: [],
  });

  // Sort state
  const [sortValue, setSortValue] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Mobile filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Build context params for filter categories API
  const filterCategoriesParams = useMemo<IFilterCategoriesParams>(
    () => ({
      brandId: contextParams.brandId,
      categoryId: contextParams.categoryId,
      isFeatured: contextParams.isFeatured,
      search: contextParams.search,
    }),
    [
      contextParams.brandId,
      contextParams.categoryId,
      contextParams.isFeatured,
      contextParams.search,
    ],
  );

  // Fetch filter categories via React Query
  const { data: categoriesData } = useFilterCategoriesQuery(
    filterCategoriesParams,
  );

  // Map API response to FilterCategory format (memoized to keep reference stable)
  const categories = useMemo<IFilterCategoryDataType[]>(
    () => categoriesData?.data ?? [],
    [categoriesData],
  );

  // Build API params from filter state
  const queryParams = useMemo<IProductListingParams>(() => {
    const params: IProductListingParams = {
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
    };

    // Context filters (fixed for the page)
    if (contextParams.brandId) params.brandId = contextParams.brandId;
    if (contextParams.categoryId) params.categoryId = contextParams.categoryId;
    if (contextParams.isFeatured !== undefined)
      params.isFeatured = contextParams.isFeatured;
    if (contextParams.search) params.search = contextParams.search;

    // User search filter (overrides context search if present)
    if (filters.searchQuery.trim()) params.search = filters.searchQuery.trim();

    // Price range filter — pick min/max from selected ranges
    if (filters.priceRanges.length > 0) {
      const selectedRanges = filters.priceRanges
        .map((id) => PRICE_RANGES.find((r) => r.id === id))
        .filter(Boolean);

      if (selectedRanges.length > 0) {
        const minPrice = Math.min(...selectedRanges.map((r) => r!.min));
        const maxPrices = selectedRanges
          .map((r) => r!.max)
          .filter((m): m is number => m !== null);
        params.minPrice = minPrice;
        if (maxPrices.length > 0) {
          params.maxPrice = Math.max(...maxPrices);
        }
      }
    }

    // Category filter — use first selected category
    if (filters.categories.length > 0) {
      const selectedCat = categories.find(
        (c) => c.slug === filters.categories[0],
      );
      if (selectedCat) params.categoryId = selectedCat.id;
    }

    // Sort
    switch (sortValue) {
      case 'newest':
        params.sortBy = 'createdAt';
        params.order = 'desc';
        break;
      case 'price-asc':
        params.sortBy = 'basePrice';
        params.order = 'asc';
        break;
      case 'price-desc':
        params.sortBy = 'basePrice';
        params.order = 'desc';
        break;
      default:
        break;
    }

    return params;
  }, [contextParams, filters, sortValue, currentPage, categories]);

  // Fetch products via React Query
  const { data, isLoading, isFetching } = useProductListingQuery(queryParams);

  const products = data?.data.items ?? [];
  const totalResults = data?.data.totalCount ?? 0;
  const totalPages = data?.data.totalPage ?? 1;

  // Reset to page 1 when filters or sort changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortValue(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      // URL-based pagination: navigate to /products/2, /products/3, etc.
      if (pageBaseUrl) {
        const href = page === 1 ? pageBaseUrl : `${pageBaseUrl}/${page}`;
        router.push(href, { scroll: true });
      }
    },
    [pageBaseUrl, router],
  );

  // Count active filters
  const activeFiltersCount = getActiveFiltersCount(filters);

  // Build getPageHref for SEO-friendly Link pagination
  const getPageHref = useMemo(() => {
    if (!pageBaseUrl) return undefined;
    return (page: number) =>
      page === 1 ? pageBaseUrl : `${pageBaseUrl}/${page}`;
  }, [pageBaseUrl]);

  return (
    <>
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
      />

      <div className={cn('flex gap-6 lg:gap-8', className)}>
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          className="hidden shrink-0 md:block md:w-52 lg:w-60"
        />

        {/* Products Section */}
        <ProductsSection
          products={products}
          totalResults={totalResults}
          selectedSort={sortValue}
          onSortChange={handleSortChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          getPageHref={getPageHref}
          onFilterClick={() => setFilterDrawerOpen(true)}
          activeFiltersCount={activeFiltersCount}
          isLoading={isLoading || isFetching}
          className="min-w-0 flex-1"
        />
      </div>
    </>
  );
}
