'use client'

import { useState } from 'react'
import { useReportBlogCommentMutation } from '@/hooks/mutations/blog-comment.mutation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from 'lucide-react'
import { BlogCommentReportReason } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

interface ReportCommentDialogProps {
  commentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const REPORT_REASONS = [
  { value: BlogCommentReportReason.SPAM, label: 'Spam' },
  {
    value: BlogCommentReportReason.INAPPROPRIATE,
    label: 'Nội dung không phù hợp',
  },
  { value: BlogCommentReportReason.HARASSMENT, label: 'Quấy rối' },
  {
    value: BlogCommentReportReason.MISINFORMATION,
    label: 'Thông tin sai lệch',
  },
  { value: BlogCommentReportReason.OTHER, label: 'Khác' },
]

export function ReportCommentDialog({
  commentId,
  open,
  onOpenChange,
}: ReportCommentDialogProps) {
  const [reason, setReason] = useState<BlogCommentReportReason>(
    BlogCommentReportReason.SPAM,
  )
  const [description, setDescription] = useState('')
  const mutation = useReportBlogCommentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await mutation.mutateAsync({
      commentId,
      reason,
      description: description.trim() || undefined,
    })

    setReason(BlogCommentReportReason.SPAM)
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Báo cáo bình luận</DialogTitle>
          <DialogDescription>
            Vui lòng chọn lý do báo cáo bình luận này
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Lý do báo cáo</Label>
            <RadioGroup
              value={reason}
              onValueChange={(v) => setReason(v as BlogCommentReportReason)}
            >
              {REPORT_REASONS.map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.value} id={item.value} />
                  <Label
                    htmlFor={item.value}
                    className="font-normal cursor-pointer"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết (tùy chọn)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả thêm về vấn đề..."
              className="min-h-[100px] resize-none"
              disabled={mutation.isPending}
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Gửi báo cáo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
