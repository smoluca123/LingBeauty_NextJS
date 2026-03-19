'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  ImageIcon,
  Settings,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';
import { formatDate } from '@/app/admin/banners/constants';

interface BannerGroupTableProps {
  groups: IBannerGroupDataType[];
  onEdit: (group: IBannerGroupDataType) => void;
  onDelete: (group: IBannerGroupDataType) => void;
  onManageBanners: (group: IBannerGroupDataType) => void;
}

export function BannerGroupTable({
  groups,
  onEdit,
  onDelete,
  onManageBanners,
}: BannerGroupTableProps) {
  return (
    <div className='rounded-lg border bg-card w-full overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[180px]'>Tên nhóm</TableHead>
            <TableHead className='hidden md:table-cell min-w-[140px]'>
              Slug
            </TableHead>
            <TableHead className='hidden sm:table-cell w-[110px]'>
              Số banner
            </TableHead>
            <TableHead className='w-[110px]'>Trạng thái</TableHead>
            <TableHead className='hidden lg:table-cell min-w-40'>
              Thời gian
            </TableHead>
            <TableHead className='hidden sm:table-cell w-[110px]'>
              Ngày tạo
            </TableHead>
            <TableHead className='text-right w-[72px]'>Thao tác</TableHead>
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
                    <span className='text-xs text-muted-foreground truncate max-w-[220px]'>
                      {group.description}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Slug */}
              <TableCell className='hidden md:table-cell text-muted-foreground text-sm font-mono'>
                {group.slug}
              </TableCell>

              {/* Banner Count */}
              <TableCell className='hidden sm:table-cell'>
                <Badge variant='outline'>
                  <ImageIcon className='h-3 w-3 mr-1' />
                  {group.banners?.length ?? 0} banner
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
                  <Calendar className='h-3 w-3 shrink-0' />
                  <span>
                    {formatDate(group.startDate)} – {formatDate(group.endDate)}
                  </span>
                </div>
              </TableCell>

              {/* Created At */}
              <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>
                {new Date(group.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>

              {/* Actions */}
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' aria-label='Thao tác'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit(group)}>
                      <Pencil className='h-4 w-4 mr-2' />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onManageBanners(group)}>
                      <Settings className='h-4 w-4 mr-2' />
                      Quản lý banners
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(group)}
                      className='text-destructive focus:text-destructive'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Xóa nhóm
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
