'use client';

import { Loader2, Ticket, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteCouponMutation } from '@/hooks/mutations/admin-coupon.mutation';
import type { ICouponDataType } from '@/lib/types/interfaces/apis/coupon.interfaces';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DeleteCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: ICouponDataType | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function DeleteCouponDialog({
  open,
  onOpenChange,
  coupon,
}: DeleteCouponDialogProps) {
  const deleteMutation = useDeleteCouponMutation();

  const handleDelete = () => {
    if (!coupon) return;

    deleteMutation.mutate(coupon.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      onOpenChange(false);
    }
  };

  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa mã giảm giá &ldquo;{coupon.code}&rdquo;?
            <br />
            <br />
            Hành động này không thể hoàn tác. Mã giảm giá sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className='bg-muted rounded-lg p-4 flex items-center gap-3 my-2'>
          <Ticket className='h-5 w-5 text-muted-foreground' />
          <div>
            <p className='font-mono font-semibold'>{coupon.code}</p>
            <p className='text-xs text-muted-foreground'>
              {coupon.type === 'PERCENTAGE'
                ? `Giảm ${coupon.value}%`
                : `Giảm ${Number(coupon.value).toLocaleString('vi-VN')}đ`}
            </p>
          </div>
        </div>

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
              'Xóa mã'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
