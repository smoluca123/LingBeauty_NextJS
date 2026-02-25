import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function InventoryFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Tìm theo tên, SKU…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
          aria-label="Tìm kiếm sản phẩm"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="in_stock">Còn hàng</SelectItem>
          <SelectItem value="low_stock">Sắp hết</SelectItem>
          <SelectItem value="out_of_stock">Hết hàng</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
