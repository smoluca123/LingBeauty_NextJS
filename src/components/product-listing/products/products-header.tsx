'use client';

import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SORT_OPTIONS, SortOption } from '../constants';

interface ProductsHeaderProps {
  totalResults: number;
  selectedSort: string;
  onSortChange: (sortValue: string) => void;
  onFilterClick?: () => void;
  activeFiltersCount?: number;
  className?: string;
}

export function ProductsHeader({
  totalResults,
  selectedSort,
  onSortChange,
  onFilterClick,
  activeFiltersCount = 0,
  className,
}: ProductsHeaderProps) {
  const selectedOption = SORT_OPTIONS.find(
    (option) => option.value === selectedSort,
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 pb-4 border-b border-gray-100',
        className,
      )}
    >
      {/* Left side - Filter button (mobile) + Results count */}
      <div className="flex items-center gap-3">
        {/* Mobile Filter Button */}
        {onFilterClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterClick}
            className="relative h-9 cursor-pointer gap-2 border-gray-200 hover:border-primary-pink hover:bg-primary-pink/5 hover:text-primary-pink md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-pink text-xs font-medium text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-primary-pink">{totalResults}</span>{' '}
          Kết quả
        </p>
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Lọc theo
        </span>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="h-9 min-w-[140px] border-gray-200 bg-white hover:bg-gray-50 focus:ring-primary-pink/20 focus:border-primary-pink">
            <SelectValue placeholder="Chọn">
              {selectedOption?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option: SortOption) => (
              <SelectItem
                key={option.id}
                value={option.value}
                className="cursor-pointer hover:bg-primary-pink/5 focus:bg-primary-pink/10 focus:text-primary-pink"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
