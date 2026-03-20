'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { ProductSearchProps } from './types';

export function ProductSearch({
  value,
  onChange,
  selectedCount,
}: ProductSearchProps) {
  return (
    <div className='flex items-center gap-4 py-4'>
      <div className='relative flex-1'>
        <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Tìm kiếm sản phẩm...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='pl-9'
        />
      </div>
      {selectedCount > 0 && (
        <Badge variant='secondary' className='h-9 px-3'>
          Đã chọn: {selectedCount}
        </Badge>
      )}
    </div>
  );
}
