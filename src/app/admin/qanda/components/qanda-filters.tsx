'use client';

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
import { ProductQuestionStatus } from '@/lib/types/interfaces/apis/product-question.interfaces';

interface QandAFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function QandAFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortValue,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: QandAFiltersProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm câu hỏi...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-9'
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả trạng thái</SelectItem>
            <SelectItem value={ProductQuestionStatus.PENDING}>
              Chờ trả lời
            </SelectItem>
            <SelectItem value={ProductQuestionStatus.ANSWERED}>
              Đã trả lời
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className='w-full sm:w-[200px]'>
            <SelectValue placeholder='Sắp xếp' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='default'>Mặc định</SelectItem>
            <SelectItem value='createdAt:desc'>Mới nhất</SelectItem>
            <SelectItem value='createdAt:asc'>Cũ nhất</SelectItem>
            <SelectItem value='updatedAt:desc'>Cập nhật gần đây</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant='outline' onClick={onClearFilters} className='gap-2'>
            <X className='h-4 w-4' />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
