'use client';

import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteFlashSaleMutation } from '@/hooks/querys/admin-flash-sale.query';
import type { IFlashSaleDataType } from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import { toast } from 'sonner';

interface DeleteFlashSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashSale: IFlashSaleDataType | null;
}

export function DeleteFlashSaleDialog({
  open,
  onOpenChange,
  flashSale,
}: DeleteFlashSaleDialogProps) {
  const deleteMutation = useDeleteFlashSaleMutation();

  const handleDelete = async () => {
    if (!flashSale) return;

    try {
      await deleteMutation.mutateAsync(flashSale.id);
      toast.success('Xóa flash sale thành công');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const productCount = flashSale?.products?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Xóa Flash Sale
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa flash sale này? Hành động này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {flashSale && (
            <div className='rounded-lg border p-4 bg-muted/50'>
              <p className='font-medium'>{flashSale.name}</p>
              <p className='text-sm text-muted-foreground'>/{flashSale.slug}</p>
              {productCount > 0 && (
                <p className='text-sm text-muted-foreground mt-1'>
                  {productCount} sản phẩm sẽ bị xóa khỏi flash sale này
                </p>
              )}
            </div>
          )}

          <div className='flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4'>
            <AlertTriangle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
            <p className='text-sm text-destructive'>
              Tất cả dữ liệu liên quan đến flash sale này sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
