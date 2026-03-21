'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/utils';
import { IReviewDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import LoadingButton from '@/components/ui/loading-button';

interface EditReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; title: string; comment: string }) => void;
  review: IReviewDataType;
  isLoading?: boolean;
}

export function EditReviewDialog({
  isOpen,
  onClose,
  onSubmit,
  review,
  isLoading = false,
}: EditReviewDialogProps) {
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title || '');
  const [comment, setComment] = useState(review.comment || '');
  const [hoverRating, setHoverRating] = useState(0);

  // Reset form when dialog opens - using requestAnimationFrame to avoid cascading renders
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setRating(review.rating);
        setTitle(review.title || '');
        setComment(review.comment || '');
      });
    }
  }, [isOpen, review]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, title, comment });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
          <DialogDescription>
            Cập nhật đánh giá của bạn về sản phẩm này.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Đánh giá của bạn</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      (hoverRating || rating) >= i + 1
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tóm tắt đánh giá của bạn"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Nội dung đánh giá</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <LoadingButton type="submit" loading={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
