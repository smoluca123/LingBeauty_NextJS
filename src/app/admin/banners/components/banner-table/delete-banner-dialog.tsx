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
import { useDeleteBannerMutation } from '@/hooks/mutations/admin-banner.mutation';
import type { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

interface DeleteBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: IBannerDataType | null;
}

export function DeleteBannerDialog({
  open,
  onOpenChange,
  banner,
}: DeleteBannerDialogProps) {
  const deleteMutation = useDeleteBannerMutation();

  const handleDelete = async () => {
    if (!banner) return;

    await deleteMutation.mutateAsync(banner.id);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            Xác nhận xóa banner
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa banner &ldquo;
            {banner.title || banner.badge || 'Không có tiêu đề'}&rdquo;?
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
              'Xóa banner'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
