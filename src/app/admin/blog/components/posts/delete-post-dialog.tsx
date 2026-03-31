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
import { useDeleteBlogPostMutation } from '@/hooks/mutations/blog.mutation'
import type { IBlogPostDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface DeletePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: IBlogPostDataType | null
}

export function DeletePostDialog({
  open,
  onOpenChange,
  post,
}: DeletePostDialogProps) {
  const deleteMutation = useDeleteBlogPostMutation()

  if (!post) return null

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(post.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bài viết <strong>{post.title}</strong>?
            Hành động này không thể hoàn tác.
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
