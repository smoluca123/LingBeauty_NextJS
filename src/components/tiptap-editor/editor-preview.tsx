'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'

interface EditorPreviewProps {
  content: string
  triggerClassName?: string
  dialogClassName?: string
}

/**
 * Component để preview HTML content từ Tiptap editor
 * Hiển thị trong dialog với styling giống như editor
 */
export function EditorPreview({
  content,
  triggerClassName,
  dialogClassName,
}: EditorPreviewProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('gap-2', triggerClassName)}
        >
          <Eye className="h-4 w-4" />
          Xem trước
        </Button>
      </DialogTrigger>
      <DialogContent className={cn('max-w-4xl max-h-[80vh]', dialogClassName)}>
        <DialogHeader>
          <DialogTitle>Xem trước nội dung</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
          <div
            className="prose prose-sm max-w-none p-4 bg-muted/30 rounded-lg [&_.hashtag]:text-primary-pink [&_.hashtag]:font-medium [&_.hashtag]:bg-primary-pink/10 [&_.hashtag]:px-1.5 [&_.hashtag]:py-0.5 [&_.hashtag]:rounded [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_a]:text-primary-pink [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
