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
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces';
import { useDeleteCategoryMutation } from '@/hooks/mutations/admin-category-brand.mutation';

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: IAdminCategoryDataType | null;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategoryMutation();

  const handleConfirm = () => {
    if (!category) return;
    deleteCategory.mutate(category.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <span>
                Bạn có chắc chắn muốn xóa danh mục &ldquo;{category?.name}&rdquo;?
              </span>
              {category?.children && category.children.length > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  ⚠ Danh mục này có {category.children.length} danh mục con.
                  Hãy xóa danh mục con trước.
                </span>
              )}
              <span className="block mt-2 text-sm text-muted-foreground">
                Hành động này không thể hoàn tác.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategory.isPending}>
            Hủy
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteCategory.isPending}
          >
            {deleteCategory.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
