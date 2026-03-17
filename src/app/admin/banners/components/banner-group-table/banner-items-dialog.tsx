'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Type,
  LayoutGrid,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';
import { CreateBannerDialog } from './create-banner-dialog';
import { EditBannerDialog } from './edit-banner-dialog';
import { DeleteBannerDialog } from './delete-banner-dialog';

interface BannerItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: IBannerGroupDataType | null;
}

export function BannerItemsDialog({
  open,
  onOpenChange,
  group,
}: BannerItemsDialogProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBannerDataType | null>(
    null,
  );

  if (!group) return null;

  const banners = group.banners?.map((mapping) => mapping.banner) || [];

  // Always find the up-to-date banner from the refreshed banners array
  const currentSelectedBanner = selectedBanner
    ? banners.find((b) => b.id === selectedBanner.id) || null
    : null;

  const handleAddNew = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (banner: IBannerDataType) => {
    setSelectedBanner(banner);
    setEditDialogOpen(true);
  };

  const handleDelete = (banner: IBannerDataType) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);
  };

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col'>
          <DialogHeader>
            <DialogTitle>Quản lý banner - {group.name}</DialogTitle>
            <DialogDescription>
              Quản lý các banner trong nhóm này
            </DialogDescription>
          </DialogHeader>

          <div className='flex justify-end mb-4'>
            <Button variant="primary-pink" onClick={handleAddNew} className='gap-2'>
              <Plus className='h-4 w-4' />
              Thêm banner
            </Button>
          </div>

          <div className='flex-1 overflow-auto rounded-lg border bg-card'>
            {banners.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-muted-foreground gap-3'>
                <ImageIcon className='h-12 w-12' />
                <p className='text-lg font-medium'>Chưa có banner nào</p>
                <p className='text-sm'>
                  Nhấn &ldquo;Thêm banner&rdquo; để tạo banner đầu tiên
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>Hình ảnh</TableHead>
                    <TableHead>Thông tin</TableHead>
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
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={banner.imageMedia.url}
                            alt={banner.title || 'Banner'}
                            className='h-12 w-16 rounded-md object-cover border'
                          />
                        ) : (
                          <div className='h-12 w-16 rounded-md bg-muted flex items-center justify-center'>
                            {banner.type === 'TEXT' ? (
                              <Type className='h-4 w-4 text-muted-foreground' />
                            ) : (
                              <ImageIcon className='h-4 w-4 text-muted-foreground' />
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
                            <span className='font-medium text-sm'>
                              {banner.title}
                            </span>
                          )}
                          {banner.description && (
                            <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                              {banner.description}
                            </span>
                          )}
                          {banner.ctaText && (
                            <span className='text-xs text-primary-pink'>
                              CTA: {banner.ctaText}
                            </span>
                          )}
                        </div>
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
                        <div className='flex items-center gap-1'>
                          <LayoutGrid className='h-3 w-3 text-muted-foreground' />
                          <span className='text-sm'>
                            {getPositionLabel(banner.position)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Sort Order */}
                      <TableCell>
                        <Badge variant='outline'>{banner.sortOrder}</Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={banner.isActive ? 'primary-pink' : 'secondary'}
                        >
                          {banner.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleEdit(banner)}
                            title='Chỉnh sửa'
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(banner)}
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
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Banner Dialog */}
      <CreateBannerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        groupId={group.id}
      />

      {/* Edit Banner Dialog */}
      <EditBannerDialog
        key={currentSelectedBanner?.id || 'new'}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        banner={currentSelectedBanner}
      />

      {/* Delete Banner Dialog */}
      <DeleteBannerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        banner={currentSelectedBanner}
      />
    </>
  );
}
