'use client';

import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReviewReplyMutation } from '@/hooks/mutations/review.mutation';

interface ReviewReplyFormProps {
  reviewId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ReviewReplyForm({
  reviewId,
  onCancel,
  onSuccess,
}: ReviewReplyFormProps) {
  const [content, setContent] = useState('');
  const createReplyMutation = useCreateReviewReplyMutation(reviewId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createReplyMutation.mutate(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent('');
          onSuccess();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Viết phản hồi của bạn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] resize-none"
        disabled={createReplyMutation.isPending}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={createReplyMutation.isPending}
        >
          <X className="h-4 w-4 mr-1" />
          Hủy
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || createReplyMutation.isPending}
          className="bg-primary-pink hover:bg-primary-pink/90"
        >
          <Send className="h-4 w-4 mr-1" />
          Gửi
        </Button>
      </div>
    </form>
  );
}
