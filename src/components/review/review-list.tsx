'use client';

import { useState } from 'react';
import { ReviewItem } from './review-item';
import { Pagination } from '@/components/pagination';
import { IReviewDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { Button } from '@/components/ui/button';
import { Star, PenLine } from 'lucide-react';

interface ReviewListProps {
  reviews: IReviewDataType[];
  productId: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onWriteReview?: () => void;
  isAuthenticated?: boolean;
}

export function ReviewList({
  reviews,
  productId,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onWriteReview,
  isAuthenticated = false,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<
    'newest' | 'highest' | 'lowest' | 'helpful'
  >('newest');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-b py-6 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-pink/10">
          <PenLine className="h-6 w-6 text-primary-pink" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Chia sẻ trải nghiệm của bạn
        </p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Hãy là ngườii đầu tiên đánh giá sản phẩm này và giúp những khách hàng
          khác đưa ra lựa chọn tốt hơn.
        </p>
        {onWriteReview && (
          <Button
            onClick={onWriteReview}
            className="mt-2 rounded-full bg-primary-pink hover:bg-primary-pink/90"
          >
            <Star className="h-4 w-4 mr-2" />
            Viết đánh giá
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort options */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {reviews.length} / {totalCount} đánh giá
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border rounded-md px-2 py-1 bg-background"
          >
            <option value="newest">Mới nhất</option>
            <option value="highest">Đánh giá cao nhất</option>
            <option value="lowest">Đánh giá thấp nhất</option>
            <option value="helpful">Hữu ích nhất</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      <div className="divide-y">
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            productId={productId}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
