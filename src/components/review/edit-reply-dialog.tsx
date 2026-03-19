'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { IReviewReplyDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import LoadingButton from '@/components/ui/loading-button';

interface EditReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string }) => void;
  reply: IReviewReplyDataType;
  isLoading?: boolean;
}

export function EditReplyDialog({
  isOpen,
  onClose,
  onSubmit,
  reply,
  isLoading = false,
}: EditReplyDialogProps) {
  const [content, setContent] = useState(reply.content);

  // Reset form when dialog opens - using requestAnimationFrame to avoid cascading renders
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setContent(reply.content);
      });
    }
  }, [isOpen, reply]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phản hồi</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung phản hồi của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              rows={4}
              required
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
