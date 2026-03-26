// Price range interface for price filter
export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

// Sort option interface for sort dropdown
export interface SortOption {
  id: string;
  label: string;
  value: string;
}

// Default price ranges for product filter
export const PRICE_RANGES: PriceRange[] = [
  { id: 'under-500k', label: 'Dưới 500.000đ', min: 0, max: 500000 },
  {
    id: '500k-1m',
    label: '500.000đ - 1.000.000đ',
    min: 500000,
    max: 1000000,
  },
  {
    id: '1m-1.5m',
    label: '1.000.000đ - 1.500.000đ',
    min: 1000000,
    max: 1500000,
  },
  {
    id: '1.5m-2m',
    label: '1.500.000đ - 2.000.000đ',
    min: 1500000,
    max: 2000000,
  },
  { id: 'over-2m', label: 'Trên 2.000.000đ', min: 2000000, max: null },
];

// Default sort options for product listing
export const SORT_OPTIONS: SortOption[] = [
  { id: 'all', label: 'Tất cả', value: 'all' },
  { id: 'newest', label: 'Mới nhất', value: 'newest' },
  { id: 'price-asc', label: 'Giá thấp - cao', value: 'price-asc' },
  { id: 'price-desc', label: 'Giá cao - thấp', value: 'price-desc' },
  { id: 'best-seller', label: 'Bán chạy', value: 'best-seller' },
];

// Default products per page
export const PRODUCTS_PER_PAGE = 10;
