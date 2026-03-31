'use client'

import { useState, useEffect } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  IReviewWithProductDataType,
  IAdminReviewFilters,
} from '@/lib/types/interfaces/apis/review.interfaces'
import {
  ReviewFilters,
  ReviewGrid,
  ReviewTable,
  ReviewStats,
  ReviewDetailDialog,
  ReviewReplyDialog,
  DeleteReviewDialog,
} from './'
import {
  useApproveReviewMutation,
  useAdminReviewsQuery,
} from '@/hooks/querys/admin-review.query'
import { TablePagination } from '@/components/table-pagination'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

// ── Debounce hook ──────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const PAGE_SIZE = 10

// ── Main Component ─────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list'

export function ReviewsContent() {
  // ── View mode state ──────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // ── Pagination state ─────────────────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  // ── Filter states ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortValue, setSortValue] = useState('default')

  // ── Debounced values ─────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(searchQuery, 300)

  // ── Dialog states ────────────────────────────────────────────────────────
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] =
    useState<IReviewWithProductDataType | null>(null)

  // ── Mutations ────────────────────────────────────────────────────────────
  const approveMutation = useApproveReviewMutation()

  // ── Parse sort value ─────────────────────────────────────────────────────
  const parsedSort = sortValue !== 'default' ? sortValue.split(':') : []
  const sortBy =
    parsedSort.length === 2
      ? (parsedSort[0] as IAdminReviewFilters['sortBy'])
      : undefined
  const order =
    parsedSort.length === 2
      ? (parsedSort[1] as IAdminReviewFilters['order'])
      : undefined

  // ── Query ────────────────────────────────────────────────────────────────
  const { data, isLoading } = useAdminReviewsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isApproved:
      statusFilter !== 'all' ? statusFilter === 'approved' : undefined,
    rating: ratingFilter !== 'all' ? Number(ratingFilter) : undefined,
    sortBy,
    order,
  })

  const result = data as
    | IApiPaginationResponseWrapperType<IReviewWithProductDataType>
    | undefined
  const reviews = result?.data?.items ?? []
  const totalCount = result?.data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // ── Check if any filter is active ────────────────────────────────────────
  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    ratingFilter !== 'all' ||
    sortValue !== 'default'

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleRatingChange = (value: string) => {
    setRatingFilter(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortValue(value)
    setPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setRatingFilter('all')
    setSortValue('default')
  }

  const handleViewDetail = (review: IReviewWithProductDataType) => {
    setSelectedReview(review)
    setDetailDialogOpen(true)
  }

  const handleApprove = async (review: IReviewWithProductDataType) => {
    await approveMutation.mutateAsync({
      reviewId: review.id,
      isApproved: true,
    })
  }

  const handleReject = async (review: IReviewWithProductDataType) => {
    await approveMutation.mutateAsync({
      reviewId: review.id,
      isApproved: false,
    })
  }

  const handleDelete = (review: IReviewWithProductDataType) => {
    setSelectedReview(review)
    setDeleteDialogOpen(true)
  }

  const handleReply = (review: IReviewWithProductDataType) => {
    setSelectedReview(review)
    setReplyDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý đánh giá
          </h1>
          <p className="text-muted-foreground">
            Quản lý và phê duyệt đánh giá từ khách hàng của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-background">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Danh sách đánh giá</h2>
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              ({totalCount} đánh giá)
            </span>
          )}
        </div>
      </div>

      {/* Content - Grid or List */}
      {viewMode === 'grid' ? (
        <ReviewGrid
          reviews={reviews}
          isLoading={isLoading}
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

      {/* Pagination */}
      {!isLoading && reviews.length > 0 && (
        <div className="shrink-0">
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalCount}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            ariaLabel="Điều hướng phân trang đánh giá"
          />
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
  )
}
