'use client';

import { AlertTriangle } from 'lucide-react';
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
import { IProductQuestionWithProduct } from '@/lib/types/interfaces/apis/product-question.interfaces';

interface DeleteQuestionDialogProps {
  question: IProductQuestionWithProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export function DeleteQuestionDialog({
  question,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteQuestionDialogProps) {
  if (!question) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-destructive' />
            Xác nhận xóa câu hỏi
          </AlertDialogTitle>
          <AlertDialogDescription className='space-y-2'>
            <p>Bạn có chắc chắn muốn xóa câu hỏi này không?</p>
            <div className='bg-muted p-3 rounded-md text-sm'>
              <p className='font-medium text-foreground mb-1'>
                Người hỏi: {question.user?.firstName} {question.user?.lastName}
              </p>
              <p className='line-clamp-2'>{question.question}</p>
            </div>
            <p className='text-destructive font-medium'>
              Hành động này không thể hoàn tác!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className='bg-destructive hover:bg-destructive/90'
          >
            {isPending ? 'Đang xóa...' : 'Xóa câu hỏi'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
