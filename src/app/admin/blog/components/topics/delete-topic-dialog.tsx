'use client'

import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteBlogTopicMutation } from '@/hooks/mutations/blog.mutation'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface DeleteTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic: IBlogTopicDataType | null
}

export function DeleteTopicDialog({
  open,
  onOpenChange,
  topic,
}: DeleteTopicDialogProps) {
  const deleteMutation = useDeleteBlogTopicMutation()

  if (!topic) return null

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(topic.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa chủ đề</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa chủ đề <strong>{topic.name}</strong>? Hành
            động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
