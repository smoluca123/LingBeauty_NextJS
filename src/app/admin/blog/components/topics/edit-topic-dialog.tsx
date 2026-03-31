'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BlogTopicForm } from './blog-topic-form'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface EditTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic: IBlogTopicDataType | null
  topics: IBlogTopicDataType[]
}

export function EditTopicDialog({
  open,
  onOpenChange,
  topic,
  topics,
}: EditTopicDialogProps) {
  if (!topic) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chủ đề</DialogTitle>
        </DialogHeader>
        {open && (
          <BlogTopicForm
            topic={topic}
            topics={topics}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
