'use client'

import { useState, useEffect } from 'react'
import { useUpdateBlogCommentMutation } from '@/hooks/mutations/blog-comment.mutation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import type { IBlogCommentDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

interface EditCommentDialogProps {
  comment: IBlogCommentDataType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCommentDialog({
  comment,
  open,
  onOpenChange,
}: EditCommentDialogProps) {
  const [content, setContent] = useState(comment.content)
  const mutation = useUpdateBlogCommentMutation()

  useEffect(() => {
    if (open) {
      setContent(comment.content)
    }
  }, [open, comment.content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    await mutation.mutateAsync({
      id: comment.id,
      data: { content: content.trim() },
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung bình luận..."
            className="min-h-[120px] resize-none"
            disabled={mutation.isPending}
          />

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
