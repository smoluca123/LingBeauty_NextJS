'use client'

import { useState } from 'react'
import { useBlogCommentsQuery } from '@/hooks/querys/blog-comment.query'
import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useBlogCommentsQuery({
    postId,
    parentId: 'null',
    page,
    limit: 10,
  })

  const comments = data?.data.items ?? []
  const totalPages = data?.data.totalPage ?? 1
  const hasNextPage = data?.data.hasNextPage ?? false
  const hasPreviousPage = data?.data.hasPreviousPage ?? false

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">
          Bình luận ({data?.data.totalCount ?? 0})
        </h2>
      </div>

      <CommentForm postId={postId} />

      <div className="mt-8">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Đang tải bình luận...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        ) : (
          <>
            <CommentList comments={comments} postId={postId} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPreviousPage}
                >
                  Trang trước
                </Button>
                <span className="text-sm text-muted-foreground">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
