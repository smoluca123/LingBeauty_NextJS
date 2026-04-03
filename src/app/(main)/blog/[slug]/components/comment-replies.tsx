'use client'

import { useState } from 'react'
import { useBlogCommentsQuery } from '@/hooks/querys/blog-comment.query'
import { CommentItem } from './comment-item'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CommentRepliesProps {
  commentId: string
  postId: string
}

export function CommentReplies({ commentId, postId }: CommentRepliesProps) {
  const [showReplies, setShowReplies] = useState(false)
  const { data, isLoading } = useBlogCommentsQuery({
    parentId: commentId,
    limit: 50,
  })

  const replies = data?.data.items ?? []
  const replyCount = data?.data.totalCount ?? 0

  if (!showReplies && replyCount === 0) return null

  return (
    <div className="mt-3">
      {replyCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplies(!showReplies)}
          className="h-8 text-xs text-primary-pink hover:text-primary-pink/80"
        >
          {showReplies ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Ẩn {replyCount} câu trả lời
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Xem {replyCount} câu trả lời
            </>
          )}
        </Button>
      )}

      {showReplies && (
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground ml-8">
              Đang tải câu trả lời...
            </div>
          ) : (
            replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                isReply
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
