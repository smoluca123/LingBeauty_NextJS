'use client'

import { useState } from 'react'
import {
  Star,
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { IReviewDataType } from '@/lib/types/interfaces/apis/review.interfaces'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/style-utils'
import {
  useMarkHelpfulMutation,
  useUnmarkHelpfulMutation,
} from '@/hooks/mutations/review.mutation'
import { useGetReviewRepliesInfiniteQuery } from '@/hooks/querys/review.query'
import { ReviewReplyForm } from '@/components/review/review-reply-form'
import { ReviewRepliesList } from '@/components/review/review-replies-list'
import { ReviewMoreActions } from './review-more-actions'
import Image from 'next/image'

interface ReviewItemProps {
  review: IReviewDataType
  productId: string
  isAuthenticated?: boolean
}

export function ReviewItem({
  review,
  productId,
  isAuthenticated = false,
}: ReviewItemProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const markHelpfulMutation = useMarkHelpfulMutation(review.id, productId)
  const unmarkHelpfulMutation = useUnmarkHelpfulMutation(review.id, productId)
  const {
    data: repliesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetReviewRepliesInfiniteQuery(review.id)

  const fetchedReplies =
    repliesData?.pages.flatMap((page) => page.data?.items ?? []) || []
  const hasReplies =
    fetchedReplies.length > 0 || (review.replies && review.replies.length > 0)
  // Prioritize replies from query (real-time updates) over review.replies (initial data)
  const displayReplies =
    fetchedReplies.length > 0 ? fetchedReplies : review.replies || []

  const handleHelpfulClick = () => {
    if (!isAuthenticated) {
      // Could trigger login modal here
      return
    }
    // For now, always mark as helpful. In a real app, you'd check if already marked
    markHelpfulMutation.mutate()
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="border-b py-6 last:border-b-0">
      {/* Review Header */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.user.avatarMedia?.url} />
          <AvatarFallback className="bg-primary-pink/10 text-primary-pink">
            {getInitials(review.user.firstName, review.user.lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {review.user.firstName} {review.user.lastName}
              </span>
              {review.isVerified && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Đã mua hàng
                </span>
              )}
            </div>
            <ReviewMoreActions review={review} productId={productId} />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    review.rating >= i + 1
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-muted text-muted',
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mt-3 pl-13">
        {review.title && (
          <h4 className="font-medium text-foreground">{review.title}</h4>
        )}
        {review.comment && (
          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
            {review.comment}
          </p>
        )}

        {/* Review Images */}
        {review.reviewImages && review.reviewImages.length > 0 && (
          <div className="flex gap-2 mt-3">
            {review.reviewImages.map((image) => (
              <div
                key={image.id}
                className="relative h-20 w-20 rounded-lg overflow-hidden border"
              >
                <Image
                  src={image.media.url}
                  alt={image.alt || 'Review image'}
                  className="h-full w-full object-cover"
                  fill
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleHelpfulClick}
            disabled={
              markHelpfulMutation.isPending || unmarkHelpfulMutation.isPending
            }
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">Hữu ích ({review.helpfulCount})</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Phản hồi</span>
          </Button>

          {hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="text-xs">{displayReplies.length} phản hồi</span>
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4">
            <ReviewReplyForm
              reviewId={review.id}
              onCancel={() => setShowReplyForm(false)}
              onSuccess={() => {
                setShowReplyForm(false)
                setShowReplies(true)
              }}
            />
          </div>
        )}

        {/* Replies */}
        {showReplies && displayReplies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-muted">
            <ReviewRepliesList
              replies={displayReplies}
              reviewId={review.id}
              onLoadMore={() => fetchNextPage()}
              hasMore={hasNextPage}
              isLoadingMore={isFetchingNextPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
