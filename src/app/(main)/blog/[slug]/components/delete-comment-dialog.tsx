'use client'

import { useDeleteBlogCommentMutation } from '@/hooks/mutations/blog-comment.mutation'
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
import { Loader2 } from 'lucide-react'

interface DeleteCommentDialogProps {
  commentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCommentDialog({
  commentId,
  open,
  onOpenChange,
}: DeleteCommentDialogProps) {
  const mutation = useDeleteBlogCommentMutation()

  const handleDelete = async () => {
    await mutation.mutateAsync(commentId)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bình luận</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
