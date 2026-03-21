'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Loader2, MessageSquare } from 'lucide-react';
import { ReviewCard } from './review-card';
import { ReviewGridSkeleton } from './review-skeleton';
import type { IReviewWithProductDataType } from '@/lib/types/interfaces/apis/review.interfaces';

interface ReviewGridProps {
  reviews: IReviewWithProductDataType[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  onViewDetail: (review: IReviewWithProductDataType) => void;
  onApprove: (review: IReviewWithProductDataType) => void;
  onReject: (review: IReviewWithProductDataType) => void;
  onDelete: (review: IReviewWithProductDataType) => void;
  onReply: (review: IReviewWithProductDataType) => void;
}

export function ReviewGrid({
  reviews,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onViewDetail,
  onApprove,
  onReject,
  onDelete,
  onReply,
}: ReviewGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Trigger fetch when scroll to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <ReviewGridSkeleton count={9} />;
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col items-center justify-center py-16 text-center'
      >
        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <MessageSquare className='h-10 w-10 text-gray-400' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Không tìm thấy đánh giá nào
        </h3>
        <p className='text-sm text-gray-500 max-w-sm'>
          Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác để tìm đánh giá phù
          hợp
        </p>
      </motion.div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ReviewCard
              review={review}
              onViewDetail={onViewDetail}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              onReply={onReply}
            />
          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className='py-4'>
        {isFetchingNextPage && (
          <div className='flex flex-col items-center gap-3'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
            <span className='text-sm text-gray-500'>Đang tải thêm...</span>
          </div>
        )}
        {!hasNextPage && reviews.length > 0 && (
          <div className='text-center py-4'>
            <span className='text-sm text-gray-400'>
              Đã hiển thị tất cả {reviews.length} đánh giá
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
