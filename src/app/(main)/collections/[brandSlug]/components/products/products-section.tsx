'use client';

import { cn } from '@/lib/utils';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { ProductsHeader } from './products-header';
import { ProductsGrid } from './products-grid';
import { Pagination } from '../../../../../../components/pagination';

interface ProductsSectionProps {
  products: IProductDataType[];
  totalResults: number;
  selectedSort: string;
  onSortChange: (sortValue: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterClick?: () => void;
  activeFiltersCount?: number;
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
  onFilterClick,
  activeFiltersCount = 0,
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

      <ProductsGrid products={products} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </section>
  );
}
