'use client';

import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ReviewFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  ratingFilter: string;
  onRatingChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'createdAt:desc', label: 'Mới nhất' },
  { value: 'createdAt:asc', label: 'Cũ nhất' },
  { value: 'rating:desc', label: 'Đánh giá cao nhất' },
  { value: 'rating:asc', label: 'Đánh giá thấp nhất' },
  { value: 'helpfulCount:desc', label: 'Hữu ích nhất' },
];

export function ReviewFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ratingFilter,
  onRatingChange,
  sortValue,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: ReviewFiltersProps) {
  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Search */}
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm đánh giá, sản phẩm...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-9'
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-2'>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className='w-[140px]'>
              <Filter className='h-4 w-4 mr-2' />
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả trạng thái</SelectItem>
              <SelectItem value='approved'>Đã phê duyệt</SelectItem>
              <SelectItem value='pending'>Chờ phê duyệt</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={onRatingChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Đánh giá' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả sao</SelectItem>
              <SelectItem value='5'>5 sao</SelectItem>
              <SelectItem value='4'>4 sao</SelectItem>
              <SelectItem value='3'>3 sao</SelectItem>
              <SelectItem value='2'>2 sao</SelectItem>
              <SelectItem value='1'>1 sao</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Sắp xếp' />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearFilters}
              className='h-9 px-2'
            >
              <X className='h-4 w-4 mr-1' />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            Bộ lọc đang áp dụng:
          </span>
          {searchQuery && (
            <Badge variant='secondary' className='gap-1'>
              Tìm kiếm: {searchQuery}
              <button onClick={() => onSearchChange('')}>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant='secondary' className='gap-1'>
              {statusFilter === 'approved' ? 'Đã phê duyệt' : 'Chờ phê duyệt'}
              <button onClick={() => onStatusChange('all')}>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {ratingFilter !== 'all' && (
            <Badge variant='secondary' className='gap-1'>
              {ratingFilter} sao
              <button onClick={() => onRatingChange('all')}>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
