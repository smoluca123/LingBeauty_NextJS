'use client';

import { cn } from '@/lib/utils/utils';
import { IFilterCategoryDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { FilterSearch } from './filter-search';
import { FilterPrice } from './filter-price';
import { FilterCategoryComponent } from './filter-category';
import { useFilterHandlers } from './use-filter-handlers';

export interface FilterState {
  searchQuery: string;
  priceRanges: string[];
  categories: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories?: IFilterCategoryDataType[];
  className?: string;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  categories = [],
  className,
}: FilterSidebarProps) {
  const { handleSearchChange, handlePriceChange, handleCategoryChange } =
    useFilterHandlers({ filters, onFiltersChange });

  return (
    <aside className={cn('space-y-4', className)}>
      {/* Search */}
      <FilterSearch value={filters.searchQuery} onChange={handleSearchChange} />

      {/* Filters - Soft pink box */}
      <div className="rounded-2xl bg-linear-to-b from-primary-pink/5 to-primary-pink/10 p-4 shadow-sm border border-primary-pink/10">
        <FilterPrice
          selectedRanges={filters.priceRanges}
          onChange={handlePriceChange}
        />

        <FilterCategoryComponent
          categories={categories}
          selectedCategories={filters.categories}
          onChange={handleCategoryChange}
        />
      </div>
    </aside>
  );
}
