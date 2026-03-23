'use client';

import { memo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import {
  IProductQuestion,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces';
import { useDeleteQuestionMutation } from '@/hooks/mutations/product-question.mutation';
import { useAuthStore } from '@/stores/auth.store';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditQuestionDialog } from '@/components/product-question/edit-question-dialog';

interface QuestionItemProps {
  question: IProductQuestion;
  productId: string;
  isAuthenticated: boolean;
}

// Memoize to prevent unnecessary re-renders (rerender-memo)
export const QuestionItem = memo(function QuestionItem({
  question,
  productId,
  isAuthenticated,
}: QuestionItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuthStore();
  const deleteMutation = useDeleteQuestionMutation(question.id, productId);

  const isOwner = user?.id === question.user.id;
  const isAnswered = question.status === ProductQuestionStatus.ANSWERED;
  const canEdit = isOwner && !isAnswered;

  // Use ternary instead of && for conditional rendering (rendering-conditional-render)
  const statusIcon = isAnswered ? (
    <CheckCircle2 className='h-4 w-4 text-green-600' />
  ) : (
    <Clock className='h-4 w-4 text-amber-600' />
  );

  const statusText = isAnswered ? 'Đã trả lời' : 'Chờ phản hồi';
  const statusColor = isAnswered ? 'text-green-600' : 'text-amber-600';

  const handleDelete = () => {
    deleteMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className='rounded-lg border bg-card p-4 space-y-3'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-2 text-sm'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary-pink/10'>
              <User className='h-4 w-4 text-primary-pink' />
            </div>
            <div>
              <p className='font-medium'>
                {question.user.firstName} {question.user.lastName}
              </p>
              <p className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(question.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* Status badge */}
            <div
              className={`flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium ${statusColor}`}
            >
              {statusIcon}
              {statusText}
            </div>

            {/* More actions menu - only show for owner */}
            {isAuthenticated && isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-foreground'
                    aria-label='Thêm tùy chọn'
                  >
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-40'>
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={() => setIsEditDialogOpen(true)}
                      className='cursor-pointer'
                    >
                      <Pencil className='mr-2 h-4 w-4' />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className='cursor-pointer text-destructive focus:text-destructive'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Question */}
        <div className='space-y-1'>
          <p className='text-sm font-medium text-foreground'>Câu hỏi của bạn</p>
          <p className='text-sm text-muted-foreground'>{question.question}</p>
        </div>

        {/* Answer - only show if answered */}
        {isAnswered && question.answer ? (
          <div className='space-y-1 rounded-lg bg-muted/50 p-3'>
            <div className='flex items-center gap-2'>
              <Avatar className='h-6 w-6'>
                {question.answeredByUser?.avatarMedia?.url && (
                  <AvatarImage
                    src={question.answeredByUser.avatarMedia.url}
                    alt={`${question.answeredByUser.firstName} ${question.answeredByUser.lastName}`}
                  />
                )}
                <AvatarFallback className='text-xs bg-primary-pink text-white'>
                  {question.answeredByUser
                    ? `${question.answeredByUser.firstName?.[0] ?? ''}${question.answeredByUser.lastName?.[0] ?? ''}`.toUpperCase()
                    : 'BA'}
                </AvatarFallback>
              </Avatar>
              <p className='text-sm font-medium text-foreground'>
                Beauty Advisor{' '}
                {question.answeredByUser
                  ? `${question.answeredByUser.firstName}`
                  : ''}
              </p>
            </div>
            <p className='text-sm text-foreground pl-8'>{question.answer}</p>
            <p className='text-xs text-muted-foreground pl-8'>
              {formatDistanceToNow(new Date(question.updatedAt), {
                addSuffix: true,
                locale: vi,
              })}
            </p>
          </div>
        ) : null}
      </div>

      {/* Edit Dialog */}
      {isAuthenticated && isOwner && canEdit && (
        <EditQuestionDialog
          questionId={question.id}
          productId={productId}
          currentQuestion={question.question}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isAuthenticated && isOwner && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa câu hỏi?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể
                hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
});
