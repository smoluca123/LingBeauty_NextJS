'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAdminUpdateBlogCommentMutation } from '@/hooks/mutations/admin-blog-comment-mutation'
import type { IBlogCommentDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: IBlogCommentDataType | null
}

export function EditCommentDialog({
  open,
  onOpenChange,
  comment,
}: EditCommentDialogProps) {
  const [content, setContent] = useState('')
  const updateMutation = useAdminUpdateBlogCommentMutation()

  useEffect(() => {
    if (comment) {
      setContent(comment.content)
    }
  }, [comment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment || !content.trim()) return

    await updateMutation.mutateAsync({
      id: comment.id,
      data: { content: content.trim() },
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
    if (comment) {
      setContent(comment.content)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sửa bình luận</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bình luận..."
              className="min-h-[150px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              {content.length} ký tự
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
