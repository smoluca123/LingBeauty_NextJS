'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import type { IReviewWithProductDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { useAdminReplyToReviewMutation } from '@/hooks/querys/admin-review.query';

interface ReviewReplyDialogProps {
  review: IReviewWithProductDataType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewReplyDialog({
  review,
  open,
  onOpenChange,
}: ReviewReplyDialogProps) {
  const [content, setContent] = useState('');
  const replyMutation = useAdminReplyToReviewMutation();

  if (!review) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  const getAvatarUrl = (user: IReviewWithProductDataType['user']) => {
    return user?.avatarMedia?.url ?? '';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmit = async () => {
    if (!content.trim() || !review) return;

    await replyMutation.mutateAsync({
      reviewId: review.id,
      data: { content: content.trim() },
    });

    setContent('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setContent('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5' />
            Phản hồi đánh giá
          </DialogTitle>
        </DialogHeader>

        {/* Review Preview */}
        <div className='bg-muted/50 rounded-lg p-4 space-y-3'>
          <div className='flex items-start gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={getAvatarUrl(review.user)} />
              <AvatarFallback className='text-sm'>
                {getInitials(review.user?.firstName, review.user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>
                  {review.user?.firstName} {review.user?.lastName}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-sm ${getRatingColor(review.rating)}`}
                >
                  <Star className='h-3 w-3 fill-current' />
                  {review.rating}
                </span>
              </div>
              <p className='text-sm text-muted-foreground truncate'>
                {review.product?.name}
              </p>
            </div>
          </div>

          {review.title && (
            <p className='font-medium text-sm'>{review.title}</p>
          )}
          {review.comment && (
            <p className='text-sm text-muted-foreground line-clamp-3'>
              {review.comment}
            </p>
          )}
        </div>

        {/* Reply Form */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Nội dung phản hồi</label>
          <Textarea
            placeholder='Nhập phản hồi của bạn...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className='resize-none'
          />
          <p className='text-xs text-muted-foreground'>
            Phản hồi sẽ được gửi với tư cách Admin
          </p>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant={'primary-pink'}
            onClick={handleSubmit}
            disabled={!content.trim() || replyMutation.isPending}
            className='gap-2'
          >
            {replyMutation.isPending ? (
              <>
                <span className='animate-spin'>⏳</span>
                Đang gửi...
              </>
            ) : (
              <>
                <Send className='h-4 w-4' />
                Gửi phản hồi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
