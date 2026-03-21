'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { IReviewWithProductDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { useDeleteReviewMutation } from '@/hooks/querys/admin-review.query';

interface DeleteReviewDialogProps {
  review: IReviewWithProductDataType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteReviewDialog({
  review,
  open,
  onOpenChange,
  onSuccess,
}: DeleteReviewDialogProps) {
  const deleteMutation = useDeleteReviewMutation();

  if (!review) return null;

  const handleDelete = async () => {
    if (!review) return;

    await deleteMutation.mutateAsync(review.id);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Xóa đánh giá
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn
            tác.
          </DialogDescription>
        </DialogHeader>

        <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
            <div className='space-y-1 text-sm'>
              <p className='font-medium text-destructive'>
                Thông tin đánh giá sẽ bị xóa:
              </p>
              <ul className='text-destructive/80 list-disc list-inside space-y-0.5'>
                <li>Nội dung đánh giá và điểm số</li>
                <li>Tất cả hình ảnh đính kèm</li>
                <li>Tất cả phản hồi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='bg-muted rounded-lg p-3 text-sm space-y-1'>
          <p>
            <span className='font-medium'>Người đánh giá:</span>{' '}
            {review.user?.firstName} {review.user?.lastName}
          </p>
          <p>
            <span className='font-medium'>Sản phẩm:</span>{' '}
            {review.product?.name}
          </p>
          <p>
            <span className='font-medium'>Đánh giá:</span> {review.rating}/5 sao
          </p>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='gap-2'
          >
            {deleteMutation.isPending ? (
              <>
                <span className='animate-spin'>⏳</span>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className='h-4 w-4' />
                Xóa đánh giá
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
