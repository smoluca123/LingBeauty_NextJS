'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { TablePagination } from '@/app/admin/components'
import { usePagination } from '@/hooks/use-pagination'
import { OrderFilters, OrderTable } from './order-table'
import { OrderDetailDialog } from './order-detail-dialog'
import { useAdminOrdersQuery } from '@/hooks/querys/admin-order.query'
import type {
  IAdminOrderFilters,
  IAdminOrderListItemDataType,
} from '@/lib/types/interfaces/apis/admin-order.interfaces'
import type { OrderStatus } from '@/lib/types/interfaces/apis/order.interfaces'

// ── Debounce hook ──────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ── Main Component ─────────────────────────────────────────────────────────

export function OrdersContent() {
  // ── Filter states ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [sortValue, setSortValue] = useState('createdAt:desc')

  // ── Debounced values ─────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(searchQuery, 300)

  // ── Pagination ──────────────────────────────────────────────────────────
  const { currentPage, pageSize, resetPage, getPaginationProps } =
    usePagination()

  // ── Dialog states ────────────────────────────────────────────────────────
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] =
    useState<IAdminOrderListItemDataType | null>(null)

  // ── Parse sort value ─────────────────────────────────────────────────────
  const parsedSort = sortValue.split(':')
  const sortBy =
    parsedSort.length === 2
      ? (parsedSort[0] as IAdminOrderFilters['sortBy'])
      : 'createdAt'
  const order =
    parsedSort.length === 2
      ? (parsedSort[1] as IAdminOrderFilters['order'])
      : 'desc'

  // ── Build query params ──────────────────────────────────────────────────
  const queryParams: IAdminOrderFilters = {
    page: currentPage,
    limit: pageSize,
    orderNumber: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy,
    order,
  }

  const { data, isLoading, isFetching } = useAdminOrdersQuery(queryParams)

  const orders = data?.data?.items ?? []
  const totalCount = data?.data?.totalCount ?? 0

  // ── Check if any filter is active ────────────────────────────────────────
  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    sortValue !== 'createdAt:desc'

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    resetPage()
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as OrderStatus | 'all')
    resetPage()
  }

  const handleSortChange = (value: string) => {
    setSortValue(value)
    resetPage()
  }

  const handleClearAll = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortValue('createdAt:desc')
    resetPage()
  }, [resetPage])

  const handleViewDetail = (order: IAdminOrderListItemDataType) => {
    setSelectedOrder(order)
    setDetailDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Đơn hàng</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý đơn hàng của cửa hàng
            {!isLoading && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({totalCount} đơn hàng)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <OrderFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          onClearAll={handleClearAll}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Order Table - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <OrderTable orders={orders} onViewDetail={handleViewDetail} />
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination {...getPaginationProps(totalCount)} />
      </div>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        orderId={selectedOrder?.id ?? null}
      />
    </div>
  )
}
