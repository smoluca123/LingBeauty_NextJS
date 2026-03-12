import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InventoryDisplayStatus } from '@/lib/types/interfaces/apis/admin-inventory.interfaces';

// ============ Types ============

export type StatusFilter = 'all' | InventoryDisplayStatus;

interface StatusOption {
  value: StatusFilter;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'IN_STOCK', label: 'Còn hàng' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
];

interface InventorySearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  /** If provided, renders the status dropdown */
  statusFilter?: StatusFilter;
  onStatusChange?: (value: StatusFilter) => void;
  statusAriaLabel?: string;
}

// ============ Component ============

export function InventorySearchFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Tìm theo tên, SKU…',
  searchAriaLabel = 'Tìm kiếm kho hàng',
  statusFilter,
  onStatusChange,
  statusAriaLabel = 'Lọc theo trạng thái',
}: InventorySearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
          aria-label={searchAriaLabel}
        />
      </div>

      {/* Status filter (optional) */}
      {statusFilter !== undefined && onStatusChange && (
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48" aria-label={statusAriaLabel}>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
