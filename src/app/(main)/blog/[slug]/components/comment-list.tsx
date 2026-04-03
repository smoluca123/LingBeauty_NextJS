'use client'

import { CommentItem } from './comment-item'
import type { IBlogCommentDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

interface CommentListProps {
  comments: IBlogCommentDataType[]
  postId: string
}

export function CommentList({ comments, postId }: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  )
}
