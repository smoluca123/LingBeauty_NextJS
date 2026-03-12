import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ICategoryDataType, IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';

// ── Flatten nested categories for dropdown ─────────────────────────────────

function flattenCategories(
  categories: ICategoryDataType[],
  prefix = '',
): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = [];
  for (const cat of categories) {
    const label = prefix ? `${prefix} / ${cat.name}` : cat.name;
    result.push({ id: cat.id, label });
    if (cat.children?.length) {
      result.push(...flattenCategories(cat.children, label));
    }
  }
  return result;
}

// ── Sort options ───────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Mới nhất' },
  { value: 'createdAt:asc', label: 'Cũ nhất' },
  { value: 'name:asc', label: 'Tên A → Z' },
  { value: 'name:desc', label: 'Tên Z → A' },
  { value: 'basePrice:asc', label: 'Giá thấp → cao' },
  { value: 'basePrice:desc', label: 'Giá cao → thấp' },
] as const;

// ── Props ──────────────────────────────────────────────────────────────────

export interface ProductFiltersProps {
  // Data
  categories: ICategoryDataType[];
  brands: IBrandDataType[];

  // Filter state
  searchQuery: string;
  onSearchChange: (value: string) => void;

  categoryFilter: string;
  onCategoryChange: (value: string) => void;

  brandFilter: string;
  onBrandChange: (value: string) => void;

  statusFilter: string;
  onStatusChange: (value: string) => void;

  featuredFilter: string;
  onFeaturedChange: (value: string) => void;

  minPrice: string;
  onMinPriceChange: (value: string) => void;

  maxPrice: string;
  onMaxPriceChange: (value: string) => void;

  sortValue: string;
  onSortChange: (value: string) => void;

  stockFilter: string;
  onStockChange: (value: string) => void;

  // Actions
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function ProductFilters({
  categories,
  brands,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  brandFilter,
  onBrandChange,
  statusFilter,
  onStatusChange,
  featuredFilter,
  onFeaturedChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortValue,
  onSortChange,
  stockFilter,
  onStockChange,
  onClearAll,
  hasActiveFilters,
}: ProductFiltersProps) {
  const flatCats = flattenCategories(categories);

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Sort + Clear */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SKU..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Mặc định</SelectItem>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-9 px-3 text-muted-foreground">
            <X className="mr-1 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Row 2: Dropdowns + Price range */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {/* Category */}
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {flatCats.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand */}
        <Select value={brandFilter} onValueChange={onBrandChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Thương hiệu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thương hiệu</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status (isActive) */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Trạng thái: Tất cả</SelectItem>
            <SelectItem value="true">Đang bán</SelectItem>
            <SelectItem value="false">Ngưng bán</SelectItem>
          </SelectContent>
        </Select>

        {/* Featured (isFeatured) */}
        <Select value={featuredFilter} onValueChange={onFeaturedChange}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Nổi bật" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Nổi bật: Tất cả</SelectItem>
            <SelectItem value="true">Nổi bật</SelectItem>
            <SelectItem value="false">Thường</SelectItem>
          </SelectContent>
        </Select>

        {/* Stock (client-side) */}
        <Select value={stockFilter} onValueChange={onStockChange}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Tồn kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tồn kho: Tất cả</SelectItem>
            <SelectItem value="in-stock">Còn hàng</SelectItem>
            <SelectItem value="low-stock">Sắp hết</SelectItem>
            <SelectItem value="out-of-stock">Hết hàng</SelectItem>
          </SelectContent>
        </Select>

        {/* Price range */}
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            placeholder="Giá từ"
            className="w-28"
            min={0}
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
          <span className="text-muted-foreground text-sm">–</span>
          <Input
            type="number"
            placeholder="Giá đến"
            className="w-28"
            min={0}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
