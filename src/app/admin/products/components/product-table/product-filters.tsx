import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  categories: IAdminCategoryDataType[];
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  categories,
}: ProductFiltersProps) {
  return (
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
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={stockFilter} onValueChange={onStockChange}>
        <SelectTrigger className="w-full sm:w-37.5">
          <SelectValue placeholder="Tồn kho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="in-stock">Còn hàng</SelectItem>
          <SelectItem value="low-stock">Sắp hết</SelectItem>
          <SelectItem value="out-of-stock">Hết hàng</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
