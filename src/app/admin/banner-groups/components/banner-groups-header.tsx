'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerGroupsHeaderProps {
  onAddGroup: () => void;
}

export function BannerGroupsHeader({ onAddGroup }: BannerGroupsHeaderProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          Quản lý nhóm Banner
        </h1>
        <p className='text-muted-foreground'>
          Quản lý các nhóm banner để phân loại và tổ chức
        </p>
      </div>
      <Button
        variant='primary-pink'
        onClick={onAddGroup}
        className='gap-2 shrink-0'
      >
        <Plus className='h-4 w-4' />
        Thêm nhóm banner
      </Button>
    </div>
  );
}
