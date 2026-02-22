'use client';

import { Home, Loader2 } from 'lucide-react';
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

interface DefaultConfirmationDialogProps {
  open: boolean;
  addressName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function DefaultConfirmationDialog({
  open,
  addressName,
  onConfirm,
  onCancel,
  isSubmitting,
}: DefaultConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-pink/10">
              <Home className="h-5 w-5 text-primary-pink" />
            </div>
            <AlertDialogTitle>
              Xác nhận đặt làm địa chỉ mặc định
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Bạn có chắc chắn muốn đặt{' '}
            <span className="font-semibold text-foreground">
              {addressName || 'địa chỉ này'}
            </span>{' '}
            làm địa chỉ mặc định?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isSubmitting}
            className="bg-primary-pink text-white hover:bg-primary-pink/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Home className="mr-2 h-4 w-4" />
                Đặt làm mặc định
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
