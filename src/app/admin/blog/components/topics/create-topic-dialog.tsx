'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { BlogTopicForm } from './blog-topic-form'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topics: IBlogTopicDataType[]
  parentTopic?: IBlogTopicDataType | null
}

export function CreateTopicDialog({
  open,
  onOpenChange,
  topics,
  parentTopic,
}: CreateTopicDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {parentTopic
              ? `Tạo chủ đề con cho "${parentTopic.name}"`
              : 'Tạo chủ đề mới'}
          </DialogTitle>
          {parentTopic && (
            <DialogDescription>
              Chủ đề con sẽ được tạo dưới chủ đề "{parentTopic.name}"
            </DialogDescription>
          )}
        </DialogHeader>
        {open && (
          <BlogTopicForm
            topics={topics}
            onClose={() => onOpenChange(false)}
            parentTopic={parentTopic}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
