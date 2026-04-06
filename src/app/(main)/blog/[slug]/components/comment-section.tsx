'use client'

import { useInfiniteBlogCommentsQuery } from '@/hooks/querys/blog-comment.query'
import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'
import { MessageSquare, Loader2 } from 'lucide-react'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBlogCommentsQuery({
      postId,
      parentId: 'null',
      limit: 10,
    })

  const comments = data?.pages.flatMap((page) => page.data.items) ?? []
  const totalCount = data?.pages[0]?.data.totalCount ?? 0

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Bình luận ({totalCount})</h2>
      </div>

      <CommentForm postId={postId} />

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
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
            <CommentList comments={comments} postId={postId} />
          </InfiniteScrollContainer>
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
