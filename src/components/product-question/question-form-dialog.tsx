'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircleQuestion } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useCreateQuestionMutation } from '@/hooks/mutations/product-question.mutation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { createQuestionSchema } from '@/lib/schemas';
import type { ProductQuestionFormValues } from '@/lib/types/forms';

interface QuestionFormDialogProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionFormDialog({
  productId,
  productName,
  isOpen,
  onClose,
}: QuestionFormDialogProps) {
  const { isAuthenticated } = useAuthStore();
  const createMutation = useCreateQuestionMutation(productId);

  const form = useForm<ProductQuestionFormValues>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question: '',
    },
    mode: 'onTouched',
  });

  const questionValue = useWatch({
    control: form.control,
    name: 'question',
    defaultValue: '',
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const handleSubmit = (data: ProductQuestionFormValues) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt câu hỏi');
      return;
    }

    createMutation.mutate(
      {
        productId,
        question: data.question,
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircleQuestion className="h-5 w-5 text-primary-pink" />
            Đặt câu hỏi về sản phẩm
          </DialogTitle>
          <DialogDescription>
            Đặt câu hỏi về <span className="font-medium">{productName}</span>.
            Chúng tôi sẽ phản hồi sớm nhất có thể.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu hỏi của bạn</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Sản phẩm này có phù hợp với da nhạy cảm không?"
                      rows={4}
                      className="resize-none"
                      disabled={createMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      {questionValue.length}/500 ký tự
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-primary-pink hover:bg-primary-pink/90"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Đang gửi...' : 'Gửi câu hỏi'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
