'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BlogTopicForm } from './blog-topic-form'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topics: IBlogTopicDataType[]
}

export function CreateTopicDialog({
  open,
  onOpenChange,
  topics,
}: CreateTopicDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo chủ đề mới</DialogTitle>
        </DialogHeader>
        {open && (
          <BlogTopicForm topics={topics} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
