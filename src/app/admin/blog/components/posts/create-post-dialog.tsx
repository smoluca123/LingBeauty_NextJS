'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BlogPostForm } from './blog-post-form'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topics: IBlogTopicDataType[]
}

export function CreatePostDialog({
  open,
  onOpenChange,
  topics,
}: CreatePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>
        {open && (
          <BlogPostForm topics={topics} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
