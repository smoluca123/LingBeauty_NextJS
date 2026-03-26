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
import type { IReviewReplyDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { useDeleteReplyMutation } from '@/hooks/querys/admin-review.query';

interface DeleteReplyDialogProps {
  reply: IReviewReplyDataType | null;
  reviewId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteReplyDialog({
  reply,
  reviewId,
  open,
  onOpenChange,
}: DeleteReplyDialogProps) {
  const deleteMutation = useDeleteReplyMutation();

  if (!reply) return null;

  const handleDelete = async () => {
    if (!reply) return;

    await deleteMutation.mutateAsync({ replyId: reply.id, reviewId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Xóa phản hồi
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn
            tác.
          </DialogDescription>
        </DialogHeader>

        <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
            <div className='space-y-1 text-sm'>
              <p className='font-medium text-destructive'>
                Phản hồi sẽ bị xóa vĩnh viễn:
              </p>
              <p className='text-destructive/80 line-clamp-2'>
                &ldquo;{reply.content}&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className='bg-muted rounded-lg p-3 text-sm space-y-1'>
          <p>
            <span className='font-medium'>Ngưởi phản hồi:</span>{' '}
            {reply.user?.firstName} {reply.user?.lastName}
          </p>
          {reply.isAdmin && (
            <p className='text-primary text-xs'>Quản trị viên</p>
          )}
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
                Xóa phản hồi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
