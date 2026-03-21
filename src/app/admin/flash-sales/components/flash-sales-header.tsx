'use client';

import { Search, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FlashSalesHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onAddFlashSale: () => void;
}

export function FlashSalesHeader({
  searchQuery,
  onSearch,
  onAddFlashSale,
}: FlashSalesHeaderProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-xl md:text-2xl font-bold flex items-center gap-2'>
          <Zap className='h-6 w-6 text-yellow-500' />
          Flash Sale
        </h1>
        <p className='text-sm md:text-base text-muted-foreground mt-1'>
          Quản lý các đợt giảm giá nhanh với thờii gian giớii hạn
        </p>
      </div>

      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative w-full sm:w-[280px]'>
          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Tìm kiếm flash sale...'
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className='pl-9 w-full'
          />
        </div>
        <Button
          onClick={onAddFlashSale}
          className='bg-primary-pink hover:bg-primary-pink/90 text-white'
        >
          <Plus className='h-4 w-4 mr-2' />
          Thêm Flash Sale
        </Button>
      </div>
    </div>
  );
}
