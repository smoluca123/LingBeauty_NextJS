'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteBannerGroupMutation } from '@/hooks/mutations/admin-banner.mutation';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

interface DeleteBannerGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: IBannerGroupDataType | null;
}

export function DeleteBannerGroupDialog({
  open,
  onOpenChange,
  group,
}: DeleteBannerGroupDialogProps) {
  const deleteMutation = useDeleteBannerGroupMutation();

  const handleDelete = async () => {
    if (!group) return;

    await deleteMutation.mutateAsync(group.id);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa nhóm banner &ldquo;{group.name}&rdquo;?
            <br />
            <br />
            {group.banners && group.banners.length > 0 && (
              <span className='text-destructive font-medium'>
                Cảnh báo: Nhóm này có {group.banners.length} banner sẽ bị xóa
                cùng.
              </span>
            )}
            <br />
            <br />
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xóa...
              </>
            ) : (
              'Xóa nhóm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
