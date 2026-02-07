'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  addressName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  open,
  addressName,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Bạn có chắc chắn muốn xóa địa chỉ{' '}
            <span className="font-semibold text-foreground">
              {addressName || 'này'}
            </span>
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa địa chỉ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
