'use client';

import { Pencil, Trash2, Images, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

interface BannerGroupTableProps {
  groups: IBannerGroupDataType[];
  onEdit: (group: IBannerGroupDataType) => void;
  onDelete: (group: IBannerGroupDataType) => void;
  onManageItems: (group: IBannerGroupDataType) => void;
}

export function BannerGroupTable({
  groups,
  onEdit,
  onDelete,
  onManageItems,
}: BannerGroupTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className='rounded-lg border bg-card max-h-full overflow-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead>Tên nhóm</TableHead>
            <TableHead className='hidden md:table-cell'>Slug</TableHead>
            <TableHead className='hidden sm:table-cell'>Số banner</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className='hidden lg:table-cell'>Thờigian</TableHead>
            <TableHead className='hidden sm:table-cell'>Ngày tạo</TableHead>
            <TableHead className='text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              {/* Name */}
              <TableCell className='font-medium'>
                <div className='flex flex-col'>
                  <span>{group.name}</span>
                  {group.description && (
                    <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                      {group.description}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Slug */}
              <TableCell className='hidden md:table-cell text-muted-foreground text-sm'>
                {group.slug}
              </TableCell>

              {/* Banner Count */}
              <TableCell className='hidden sm:table-cell'>
                <Badge variant='outline'>
                  {group.banners?.length || 0} banner
                </Badge>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant={group.isActive ? 'primary-pink' : 'secondary'}>
                  {group.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                </Badge>
              </TableCell>

              {/* Date Range */}
              <TableCell className='hidden lg:table-cell text-muted-foreground text-sm'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>
                    {formatDate(group.startDate)} - {formatDate(group.endDate)}
                  </span>
                </div>
              </TableCell>

              {/* Created At */}
              <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>
                {new Date(group.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>

              {/* Actions */}
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onManageItems(group)}
                    title='Quản lý banner'
                  >
                    <Images className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(group)}
                    title='Chỉnh sửa'
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(group)}
                    title='Xóa'
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
