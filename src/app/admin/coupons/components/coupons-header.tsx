'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponsHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onAddCoupon: () => void;
}

export function CouponsHeader({
  searchQuery,
  onSearch,
  onAddCoupon,
}: CouponsHeaderProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Quản lý Mã giảm giá
          </h1>
          <p className='text-muted-foreground'>
            Quản lý các mã giảm giá trong hệ thống
          </p>
        </div>
        <Button
          variant='primary-pink'
          onClick={onAddCoupon}
          className='gap-2 shrink-0'
        >
          <Plus className='h-4 w-4' />
          Thêm mã giảm giá
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm mã giảm giá...'
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className='pl-8'
            name='search'
            autoComplete='off'
          />
        </div>
      </div>
    </div>
  );
}
