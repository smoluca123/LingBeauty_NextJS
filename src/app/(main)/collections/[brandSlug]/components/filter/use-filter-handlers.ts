import { FilterState } from './filter-sidebar';

interface UseFilterHandlersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

/**
 * Custom hook to handle filter state changes
 * Eliminates duplicate handler logic across FilterSidebar and FilterDrawer
 */
export function useFilterHandlers({
  filters,
  onFiltersChange,
}: UseFilterHandlersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handlePriceChange = (ranges: string[]) => {
    onFiltersChange({ ...filters, priceRanges: ranges });
  };

  const handleCategoryChange = (categories: string[]) => {
    onFiltersChange({ ...filters, categories });
  };

  const handleClearAll = () => {
    onFiltersChange({
      searchQuery: '',
      priceRanges: [],
      categories: [],
    });
  };

  return {
    handleSearchChange,
    handlePriceChange,
    handleCategoryChange,
    handleClearAll,
  };
}
