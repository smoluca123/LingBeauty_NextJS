'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

interface BannersHeaderProps {
  groups: IBannerGroupDataType[];
  selectedGroupId: string | null;
  onGroupChange: (groupId: string | null) => void;
  onSearch?: (query: string) => void;
  onAddBanner: () => void;
}

export function BannersHeader({
  groups,
  selectedGroupId,
  onGroupChange,
  onSearch,
  onAddBanner,
}: BannersHeaderProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Quản lý Banner</h1>
          <p className='text-muted-foreground'>Quản lý các banner trong các nhóm</p>
        </div>
        <Button
          variant='primary-pink'
          onClick={onAddBanner}
          className='gap-2 shrink-0 w-fit'
        >
          <Plus className='h-4 w-4' />
          Thêm banner
        </Button>
      </div>

      {/* Filters row */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
        {onSearch && (
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm banner...'
              onChange={(e) => onSearch(e.target.value)}
              className='pl-8'
            />
          </div>
        )}
        <Select
          value={selectedGroupId || 'all'}
          onValueChange={(value) => onGroupChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className='w-full sm:w-[200px]'>
            <SelectValue placeholder='Chọn nhóm banner' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả nhóm</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
