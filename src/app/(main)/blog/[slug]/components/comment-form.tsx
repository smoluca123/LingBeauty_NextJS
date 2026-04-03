'use client'

import { useState } from 'react'
import { useCreateBlogCommentMutation } from '@/hooks/mutations/blog-comment.mutation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import Link from 'next/link'

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
  placeholder?: string
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = 'Viết bình luận của bạn...',
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const { user } = useAuthStore()
  const mutation = useCreateBlogCommentMutation(postId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    await mutation.mutateAsync({
      postId,
      content: content.trim(),
      parentId,
    })

    setContent('')
    onSuccess?.()
  }

  if (!user) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-muted-foreground mb-2">
          Bạn cần đăng nhập để bình luận
        </p>
        <Link href="/auth/login">
          <Button variant="default" size="sm">
            Đăng nhập
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        disabled={mutation.isPending}
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={!content.trim() || mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {parentId ? 'Trả lời' : 'Bình luận'}
        </Button>
      </div>
    </form>
  )
}
