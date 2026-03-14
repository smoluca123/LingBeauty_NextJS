'use client';

import { useState } from 'react';
import { PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSummary } from '@/components/review/review-summary';
import { ReviewList } from '@/components/review/review-list';
import { ReviewFormDialog } from '@/components/review/review-form-dialog';
import {
  useGetPublicProductReviewsQuery,
  useGetProductReviewSummaryQuery,
} from '@/hooks/querys/review.query';
import { useAuthStore } from '@/stores/auth.store';

interface ProductDetailReviewTabProps {
  productId: string;
  productName: string;
}

export function ProductDetailReviewTab({
  productId,
  productName,
}: ProductDetailReviewTabProps) {
  const [page, setPage] = useState(1);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const { data: reviewsData, isLoading: isReviewsLoading } =
    useGetPublicProductReviewsQuery(productId, { page, limit: 10 });

  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetProductReviewSummaryQuery(productId);

  const reviews = reviewsData?.data?.items || [];
  const totalCount = reviewsData?.data?.totalCount || 0;
  const summary = summaryData?.data || null;

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <ReviewSummary summary={summary} isLoading={isSummaryLoading} />

      {/* Write review CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Đánh giá từ khách hàng</h3>
          <p className="text-sm text-muted-foreground">
            {totalCount > 0 ? `${totalCount} đánh giá` : 'Chưa có đánh giá nào'}
          </p>
        </div>
        <Button
          onClick={() => setIsWriteDialogOpen(true)}
          className="bg-primary-pink hover:bg-primary-pink/90"
        >
          <PenLine className="h-4 w-4 mr-2" />
          Viết đánh giá
        </Button>
      </div>

      {/* Reviews List */}
      <ReviewList
        reviews={reviews}
        productId={productId}
        totalCount={totalCount}
        currentPage={page}
        pageSize={10}
        isLoading={isReviewsLoading}
        onPageChange={setPage}
        onWriteReview={() => setIsWriteDialogOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      {/* Write Review Dialog */}
      <ReviewFormDialog
        productId={productId}
        productName={productName}
        isOpen={isWriteDialogOpen}
        onClose={() => setIsWriteDialogOpen(false)}
      />
    </div>
  );
}
