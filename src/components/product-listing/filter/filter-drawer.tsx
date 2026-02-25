'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IFilterCategoryDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { FilterSearch } from './filter-search';
import { FilterPrice } from './filter-price';
import { FilterCategoryComponent } from './filter-category';
import { FilterState } from './filter-sidebar';
import { useFilterHandlers } from './use-filter-handlers';
import { getActiveFiltersCount } from './filter-utils';

interface FilterDrawerProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories?: IFilterCategoryDataType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterDrawer({
  filters,
  onFiltersChange,
  categories = [],
  open,
  onOpenChange,
}: FilterDrawerProps) {
  const {
    handleSearchChange,
    handlePriceChange,
    handleCategoryChange,
    handleClearAll,
  } = useFilterHandlers({ filters, onFiltersChange });

  const activeFiltersCount = getActiveFiltersCount(filters);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
        {/* Header */}
        <SheetHeader className="border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Bộ lọc</SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 px-3 text-sm text-muted-foreground hover:text-primary-pink"
              >
                Xoá tất cả
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Filter Content */}
        <div className="flex flex-col h-[calc(100vh-120px)] overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* Search */}
            <FilterSearch
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />

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
          </div>
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-11 bg-primary-pink hover:bg-primary-pink/90 text-white font-medium rounded-xl"
          >
            Áp dụng bộ lọc
            {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
