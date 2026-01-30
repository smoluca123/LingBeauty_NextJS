import { FilterState } from './filter-sidebar';

/**
 * Calculate the count of active filters
 */
export function getActiveFiltersCount(filters: FilterState): number {
  return (
    (filters.searchQuery ? 1 : 0) +
    filters.priceRanges.length +
    filters.categories.length
  );
}

/**
 * Create an empty/reset filter state
 */
export function createEmptyFilterState(): FilterState {
  return {
    searchQuery: '',
    priceRanges: [],
    categories: [],
  };
}
