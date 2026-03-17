'use client';

import { Pencil, Trash2, Type, LayoutGrid } from 'lucide-react';
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
import type {
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';
import Image from 'next/image';

interface BannerTableProps {
  banners: Array<IBannerDataType & { groupId?: string; groupName?: string }>;
  onEdit: (banner: IBannerDataType & { groupId?: string }) => void;
  onDelete: (banner: IBannerDataType & { groupId?: string }) => void;
}

export function BannerTable({
  banners,
  onEdit,
  onDelete,
}: BannerTableProps) {
  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'MAIN_CAROUSEL':
        return 'Carousel chính';
      case 'SIDE_TOP':
        return 'Bên phải (trên)';
      case 'SIDE_BOTTOM':
        return 'Bên phải (dưới)';
      default:
        return position;
    }
  };

  return (
    <div className='rounded-lg border bg-card max-h-full overflow-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>Hình ảnh</TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Nhóm</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className='text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              {/* Image */}
              <TableCell>
                {banner.imageMedia?.url ? (
                  <Image
                    src={banner.imageMedia.url}
                    alt={banner.title || 'Banner'}
                    width={48}
                    height={48}
                    className='h-12 w-16 rounded-md object-cover border'
                  />
                ) : (
                  <div className='h-12 w-16 rounded-md bg-muted flex items-center justify-center'>
                    {banner.type === 'TEXT' ? (
                      <Type className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <LayoutGrid className='h-4 w-4 text-muted-foreground' />
                    )}
                  </div>
                )}
              </TableCell>

              {/* Info */}
              <TableCell>
                <div className='flex flex-col gap-0.5'>
                  {banner.badge && (
                    <Badge variant='outline' className='text-xs w-fit'>
                      {banner.badge}
                    </Badge>
                  )}
                  {banner.title && (
                    <span className='font-medium text-sm'>{banner.title}</span>
                  )}
                  {banner.description && (
                    <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                      {banner.description}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Group */}
              <TableCell>
                <Badge variant='secondary' className='text-xs'>
                  {banner.groupName || '—'}
                </Badge>
              </TableCell>

              {/* Type */}
              <TableCell>
                <Badge
                  variant={
                    banner.type === 'TEXT' ? 'primary-pink' : 'secondary'
                  }
                >
                  {banner.type === 'TEXT' ? 'Text' : 'Hình ảnh'}
                </Badge>
              </TableCell>

              {/* Position */}
              <TableCell>
                <span className='text-sm'>
                  {getPositionLabel(banner.position)}
                </span>
              </TableCell>

              {/* Sort Order */}
              <TableCell>
                <Badge variant='outline'>{banner.sortOrder}</Badge>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant={banner.isActive ? 'primary-pink' : 'secondary'}>
                  {banner.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                </Badge>
              </TableCell>

              {/* Actions */}
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(banner)}
                    title='Chỉnh sửa'
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(banner)}
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
