'use client'

import { Star } from 'lucide-react'
import { IReviewSummaryDataType } from '@/lib/types/interfaces/apis/review.interfaces'
import { cn } from '@/lib/utils/style-utils'

interface ReviewSummaryProps {
  summary: IReviewSummaryDataType | null
  isLoading?: boolean
}

export function ReviewSummary({ summary, isLoading }: ReviewSummaryProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center animate-pulse">
        <div className="flex flex-col items-center gap-1.5 min-w-fit">
          <div className="h-16 w-20 bg-muted rounded" />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 w-5 bg-muted rounded" />
            ))}
          </div>
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-2 flex-1 bg-muted rounded-full" />
              <div className="h-4 w-6 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-1.5 min-w-fit">
          <p className="text-6xl font-bold text-foreground">—</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-200 text-amber-200" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Chưa có đánh giá</p>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right text-muted-foreground">
                {star}
              </span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div className="h-2 w-0 rounded-full bg-amber-400 transition-all" />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">
                0
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { averageRating, approvedReviews, ratingDistribution } = summary
  const maxCount = Math.max(...Object.values(ratingDistribution))

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
      {/* Average rating */}
      <div className="flex flex-col items-center gap-1.5 min-w-fit">
        <p className="text-6xl font-bold text-foreground">
          {averageRating.toFixed(1)}
        </p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-5 w-5',
                averageRating >= i + 1
                  ? 'fill-amber-400 text-amber-400'
                  : averageRating >= i + 0.5
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-muted text-muted',
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {approvedReviews} đánh giá
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            ratingDistribution[star as keyof typeof ratingDistribution] || 0
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right text-muted-foreground">
                {star}
              </span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-amber-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
