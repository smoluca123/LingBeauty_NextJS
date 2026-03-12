'use client';

import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { IAdminBrandDataType } from '@/lib/types/interfaces/apis/admin-brand.interfaces';
import { useDeleteBrandMutation } from '@/hooks/querys/admin-category-brand.query';

interface DeleteBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: IAdminBrandDataType | null;
}

export function DeleteBrandDialog({ open, onOpenChange, brand }: DeleteBrandDialogProps) {
  const deleteBrand = useDeleteBrandMutation();

  const handleConfirm = () => {
    if (!brand) return;
    deleteBrand.mutate(brand.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa thương hiệu</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <span>
                Bạn có chắc chắn muốn xóa thương hiệu &ldquo;{brand?.name}&rdquo;?
              </span>
              <span className="block mt-2 text-sm text-muted-foreground">
                Thương hiệu phải không có sản phẩm liên kết mới có thể xóa.
                Hành động này không thể hoàn tác.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBrand.isPending}>Hủy</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteBrand.isPending}
          >
            {deleteBrand.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
