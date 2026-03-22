'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  updateQuestionSchema,
  type UpdateQuestionValues,
} from '@/lib/zod-schemas/product-question.schema';
import { useUpdateQuestionMutation } from '@/hooks/mutations/product-question.mutation';

interface EditQuestionDialogProps {
  questionId: string;
  productId: string;
  currentQuestion: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditQuestionDialog({
  questionId,
  productId,
  currentQuestion,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditQuestionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const { mutate: updateQuestion, isPending } = useUpdateQuestionMutation(
    questionId,
    productId
  );

  const form = useForm<UpdateQuestionValues>({
    resolver: zodResolver(updateQuestionSchema),
    defaultValues: {
      question: currentQuestion,
    },
  });

  // Reset form when dialog opens with current question
  useEffect(() => {
    if (open) {
      form.reset({ question: currentQuestion });
    }
  }, [open, currentQuestion, form]);

  const onSubmit = (data: UpdateQuestionValues) => {
    updateQuestion(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
        <DialogDescription>
          Cập nhật nội dung câu hỏi của bạn
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Câu hỏi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập câu hỏi của bạn..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );

  // If controlled, don't render trigger button
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  // If uncontrolled, render with trigger button
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
