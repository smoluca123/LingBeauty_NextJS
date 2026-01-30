'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { FilterSidebar, FilterState, FilterDrawer } from './filter';
import { getActiveFiltersCount } from './filter/filter-utils';
import { ProductsSection } from './products/products-section';
import { priceRanges } from './mock-products';

const PRODUCTS_PER_PAGE = 8;

interface CollectionProductsProps {
  products: IProductDataType[];
  className?: string;
}

export function CollectionProducts({
  products,
  className,
}: CollectionProductsProps) {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priceRanges: [],
    categories: [],
  });

  // Sort state
  const [sortValue, setSortValue] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Apply filters to products
  const filteredProducts = filterProducts(products, filters);

  // Apply sorting
  const sortedProducts = sortProducts(filteredProducts, sortValue);

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters or sort changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortValue(newSort);
    setCurrentPage(1);
  };

  // Count active filters using shared utility
  const activeFiltersCount = getActiveFiltersCount(filters);

  return (
    <>
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        filters={filters}
        onFiltersChange={handleFiltersChange}
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
      />

      <div className={cn('flex gap-6 lg:gap-8', className)}>
        {/* Filter Sidebar - Hidden on small screens, narrower on medium screens */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          className="hidden shrink-0 md:block md:w-52 lg:w-60"
        />

        {/* Products Section - Takes remaining space, min-w-0 prevents overflow */}
        <ProductsSection
          products={paginatedProducts}
          totalResults={sortedProducts.length}
          selectedSort={sortValue}
          onSortChange={handleSortChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onFilterClick={() => setFilterDrawerOpen(true)}
          activeFiltersCount={activeFiltersCount}
          className="min-w-0 flex-1"
        />
      </div>
    </>
  );
}

// Filter products based on filter state
function filterProducts(
  products: IProductDataType[],
  filters: FilterState
): IProductDataType[] {
  let result = [...products];

  // Filter by search query
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.shortDesc.toLowerCase().includes(query)
    );
  }

  // Filter by price ranges
  if (filters.priceRanges.length > 0) {
    result = result.filter((product) => {
      const price = Number(product.basePrice);
      return filters.priceRanges.some((rangeId) => {
        const range = priceRanges.find((r) => r.id === rangeId);
        if (!range) return false;

        if (range.max === null) {
          return price >= range.min;
        }
        return price >= range.min && price < range.max;
      });
    });
  }

  // Filter by categories
  if (filters.categories.length > 0) {
    result = result.filter((product) =>
      product.productCategories.some((pc) =>
        filters.categories.includes(pc.category.slug)
      )
    );
  }

  return result;
}

// Sort products based on sort value
function sortProducts(
  products: IProductDataType[],
  sortValue: string
): IProductDataType[] {
  const result = [...products];

  switch (sortValue) {
    case 'newest':
      return result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'price-asc':
      return result.sort(
        (a, b) => Number(a.basePrice) - Number(b.basePrice)
      );
    case 'price-desc':
      return result.sort(
        (a, b) => Number(b.basePrice) - Number(a.basePrice)
      );
    case 'best-seller':
      return result.sort(
        (a, b) => (b.stats?.totalSold ?? 0) - (a.stats?.totalSold ?? 0)
      );
    default:
      return result;
  }
}
