'use client';

import { cn } from '@/lib/utils/utils';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { Pagination } from '@/components/pagination';
import { ProductsHeader } from './products-header';
import { ProductsGrid } from './products-grid';

interface ProductsSectionProps {
  products: IProductDataType[];
  totalResults: number;
  selectedSort: string;
  onSortChange: (sortValue: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** When provided, pagination renders SEO-friendly <Link> elements */
  getPageHref?: (page: number) => string;
  onFilterClick?: () => void;
  activeFiltersCount?: number;
  isLoading?: boolean;
  className?: string;
}

export function ProductsSection({
  products,
  totalResults,
  selectedSort,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  onFilterClick,
  activeFiltersCount = 0,
  isLoading = false,
  className,
}: ProductsSectionProps) {
  return (
    <section className={cn('flex flex-col', className)}>
      <ProductsHeader
        totalResults={totalResults}
        selectedSort={selectedSort}
        onSortChange={onSortChange}
        onFilterClick={onFilterClick}
        activeFiltersCount={activeFiltersCount}
        className="mb-4"
      />

      <div
        className={cn(
          'relative transition-opacity',
          isLoading && products.length > 0 && 'opacity-50 pointer-events-none',
        )}
      >
        <ProductsGrid products={products} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        getPageHref={getPageHref}
        className="mt-8"
      />
    </section>
  );
}
