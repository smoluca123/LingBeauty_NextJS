'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BlogPostForm } from './blog-post-form'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'

interface EditPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: IBlogPostDataType | null
  topics: IBlogTopicDataType[]
}

export function EditPostDialog({
  open,
  onOpenChange,
  post,
  topics,
}: EditPostDialogProps) {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>
        {open && (
          <BlogPostForm
            post={post}
            topics={topics}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
