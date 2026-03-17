'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  onAddBanner: () => void;
}

export function BannersHeader({
  groups,
  selectedGroupId,
  onGroupChange,
  onAddBanner,
}: BannersHeaderProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Quản lý Banner</h1>
        <p className='text-muted-foreground'>
          Quản lý các banner trong các nhóm
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <Select
          value={selectedGroupId || 'all'}
          onValueChange={(value) =>
            onGroupChange(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className='w-[200px]'>
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
        <Button
          variant='primary-pink'
          onClick={onAddBanner}
          className='gap-2 shrink-0'
        >
          <Plus className='h-4 w-4' />
          Thêm banner
        </Button>
      </div>
    </div>
  );
}
