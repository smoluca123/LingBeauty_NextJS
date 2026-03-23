'use client';

import { useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IProductQuestionWithProduct,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces';
import {
  answerFormSchema,
  type AnswerFormValues,
} from '../schemas/answer-form.schema';

interface AnswerDialogProps {
  question: IProductQuestionWithProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AnswerFormValues) => Promise<void>;
  onDeleteAnswer?: (questionId: string) => Promise<void>;
  isPending?: boolean;
  isDeleting?: boolean;
}

export function AnswerDialog({
  question,
  open,
  onOpenChange,
  onSubmit,
  onDeleteAnswer,
  isPending,
  isDeleting,
}: AnswerDialogProps) {
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: {
      answer: '',
    },
  });

  useEffect(() => {
    if (question && open) {
      form.reset({
        answer: question.answer ?? '',
      });
    }
  }, [question, open, form]);

  if (!question) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  const handleSubmit = async (data: AnswerFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isUpdate = question.status === ProductQuestionStatus.ANSWERED;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5' />
            {isUpdate ? 'Cập nhật câu trả lời' : 'Trả lời câu hỏi'}
          </DialogTitle>
        </DialogHeader>

        <div className='bg-muted/50 rounded-lg p-4 space-y-3'>
          <div className='flex items-start gap-3'>
            <Avatar className='h-10 w-10'>
              {question.user?.avatarMedia?.url && (
                <AvatarImage
                  src={question.user.avatarMedia.url}
                  alt={`${question.user.firstName} ${question.user.lastName}`}
                />
              )}
              <AvatarFallback className='text-sm'>
                {getInitials(question.user?.firstName, question.user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>
                  {question.user?.firstName} {question.user?.lastName}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-start gap-3 pt-2 border-t'>
            {question.product?.images?.[0]?.media?.url && (
              <div className='relative h-16 w-16 rounded-md overflow-hidden border bg-white shrink-0'>
                <Image
                  src={question.product.images[0].media.url}
                  alt={question.product.name}
                  fill
                  className='object-cover'
                />
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium line-clamp-2'>
                {question.product?.name}
              </div>
              <div className='text-xs text-muted-foreground mt-1'>
                Slug: {question.product?.slug}
              </div>
            </div>
          </div>

          <div className='space-y-2 pt-2 border-t'>
            <div className='text-sm font-medium'>Câu hỏi:</div>
            <div className='text-sm text-muted-foreground'>
              {question.question}
            </div>
          </div>

          {isUpdate && question.answer && (
            <div className='space-y-2 pt-2 border-t'>
              <div className='text-sm font-medium'>Câu trả lời hiện tại:</div>
              <div className='text-sm text-muted-foreground'>
                {question.answer}
              </div>
            </div>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='answer'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isUpdate ? 'Câu trả lời mới' : 'Câu trả lời'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập câu trả lời của bạn...'
                      rows={6}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='flex-col sm:flex-row gap-2'>
              {isUpdate && onDeleteAnswer && (
                <Button
                  type='button'
                  variant='destructive'
                  onClick={() => onDeleteAnswer(question.id)}
                  disabled={isPending || isDeleting}
                  className='gap-2 sm:mr-auto'
                >
                  {isDeleting ? (
                    <>
                      <span className='animate-spin'>⏳</span>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className='h-4 w-4' />
                      Xóa câu trả lời
                    </>
                  )}
                </Button>
              )}
              <div className='flex gap-2 sm:ml-auto'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  disabled={isPending || isDeleting}
                >
                  Hủy
                </Button>
                <Button
                  type='submit'
                  variant='primary-pink'
                  disabled={isPending || isDeleting}
                  className='gap-2'
                >
                  {isPending ? (
                    <>
                      <span className='animate-spin'>⏳</span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className='h-4 w-4' />
                      {isUpdate ? 'Cập nhật' : 'Gửi câu trả lời'}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
