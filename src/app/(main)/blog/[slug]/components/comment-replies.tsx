'use client'

import { useState } from 'react'
import { useInfiniteBlogCommentsQuery } from '@/hooks/querys/blog-comment.query'
import { CommentItem } from './comment-item'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'

interface CommentRepliesProps {
  commentId: string
  postId: string
}

export function CommentReplies({ commentId, postId }: CommentRepliesProps) {
  const [showReplies, setShowReplies] = useState(false)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBlogCommentsQuery({
      parentId: commentId,
      limit: 20,
    })

  const replies = data?.pages.flatMap((page) => page.data.items) ?? []
  const replyCount = data?.pages[0]?.data.totalCount ?? 0

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
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <InfiniteScrollContainer
              onBottomReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage()
                }
              }}
              isShowInViewElement={hasNextPage && !isFetchingNextPage}
            >
              <div className="space-y-4">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    isReply
                  />
                ))}
              </div>
            </InfiniteScrollContainer>
          )}

          {isFetchingNextPage && (
            <div className="flex justify-center py-2 mt-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
