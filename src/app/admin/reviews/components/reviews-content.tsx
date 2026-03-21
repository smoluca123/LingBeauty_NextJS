'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  IReviewWithProductDataType,
  IAdminReviewFilters,
} from '@/lib/types/interfaces/apis/review.interfaces';
import {
  ReviewFilters,
  ReviewGrid,
  ReviewTable,
  ReviewStats,
  ReviewDetailDialog,
  ReviewReplyDialog,
  DeleteReviewDialog,
} from './';
import { useApproveReviewMutation } from '@/hooks/querys/admin-review.query';
import { useInfiniteAdminReviews } from '@/hooks/querys/use-infinite-admin-reviews.query';

// ── Debounce hook ──────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Main Component ─────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

export function ReviewsContent() {
  // ── View mode state ──────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // ── Filter states ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortValue, setSortValue] = useState('default');

  // ── Debounced values ─────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(searchQuery, 300);

  // ── Dialog states ────────────────────────────────────────────────────────
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<IReviewWithProductDataType | null>(null);

  // ── Mutations ────────────────────────────────────────────────────────────
  const approveMutation = useApproveReviewMutation();

  // ── Parse sort value ─────────────────────────────────────────────────────
  const parsedSort = sortValue !== 'default' ? sortValue.split(':') : [];
  const sortBy =
    parsedSort.length === 2
      ? (parsedSort[0] as IAdminReviewFilters['sortBy'])
      : undefined;
  const order =
    parsedSort.length === 2
      ? (parsedSort[1] as IAdminReviewFilters['order'])
      : undefined;

  // ── Infinite Query ───────────────────────────────────────────────────────
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteAdminReviews({
      search: debouncedSearch || undefined,
      isApproved:
        statusFilter !== 'all' ? statusFilter === 'approved' : undefined,
      rating: ratingFilter !== 'all' ? Number(ratingFilter) : undefined,
      sortBy,
      order,
      pageSize: 12,
    });

  // Flatten all pages into single array
  const reviews = data?.pages.flatMap((page) => page.data.items) ?? [];
  const totalCount = data?.pages[0]?.data.totalCount ?? 0;

  // ── Check if any filter is active ────────────────────────────────────────
  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    ratingFilter !== 'all' ||
    sortValue !== 'default';

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleRatingChange = (value: string) => {
    setRatingFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRatingFilter('all');
    setSortValue('default');
  };

  const handleViewDetail = (review: IReviewWithProductDataType) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  const handleApprove = async (review: IReviewWithProductDataType) => {
    await approveMutation.mutateAsync({
      reviewId: review.id,
      isApproved: true,
    });
  };

  const handleReject = async (review: IReviewWithProductDataType) => {
    await approveMutation.mutateAsync({
      reviewId: review.id,
      isApproved: false,
    });
  };

  const handleDelete = (review: IReviewWithProductDataType) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };

  const handleReply = (review: IReviewWithProductDataType) => {
    setSelectedReview(review);
    setReplyDialogOpen(true);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Quản lý đánh giá</h1>
          <p className='text-muted-foreground'>
            Quản lý và phê duyệt đánh giá từ khách hàng của bạn.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {/* View Mode Toggle */}
          <div className='flex items-center border rounded-lg p-1 bg-background'>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size='icon'
              onClick={() => setViewMode('grid')}
              className='h-8 w-8'
            >
              <LayoutGrid className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              onClick={() => setViewMode('list')}
              className='h-8 w-8'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ReviewStats />

      {/* Filters */}
      <ReviewFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        ratingFilter={ratingFilter}
        onRatingChange={handleRatingChange}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Results Count */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold'>Danh sách đánh giá</h2>
          {!isLoading && (
            <span className='text-sm text-muted-foreground'>
              ({totalCount} đánh giá)
            </span>
          )}
        </div>
        {isFetchingNextPage && (
          <span className='text-sm text-muted-foreground flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Đang tải thêm...
          </span>
        )}
      </div>

      {/* Content - Grid or List */}
      {viewMode === 'grid' ? (
        <ReviewGrid
          reviews={reviews}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          onViewDetail={handleViewDetail}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      ) : (
        <ReviewTable
          reviews={reviews}
          isLoading={isLoading}
          onViewDetail={handleViewDetail}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      )}

      {/* Infinite scroll loader for list view */}
      {viewMode === 'list' && (
        <div className='py-4 text-center'>
          {isFetchingNextPage ? (
            <div className='flex flex-col items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
              <span className='text-sm text-gray-500'>Đang tải thêm...</span>
            </div>
          ) : hasNextPage ? (
            <Button
              variant='outline'
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Tải thêm
            </Button>
          ) : reviews.length > 0 ? (
            <span className='text-sm text-gray-400'>
              Đã hiển thị tất cả {reviews.length} đánh giá
            </span>
          ) : null}
        </div>
      )}

      {/* Dialogs */}
      <ReviewDetailDialog
        review={selectedReview}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <ReviewReplyDialog
        review={selectedReview}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
      />

      <DeleteReviewDialog
        review={selectedReview}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}
