'use client'

import { useState } from 'react'
import { Loader2, Ticket } from 'lucide-react'
import { useAdminCouponsQuery } from '@/hooks/querys/admin-coupon.query'
import type { ICouponDataType } from '@/lib/types/interfaces/apis/coupon.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { CouponsHeader } from './coupons-header'
import { CouponTable } from './coupon-table'
import { CreateCouponDialog } from './create-coupon-dialog'
import { EditCouponDialog } from './edit-coupon-dialog'
import { DeleteCouponDialog } from './delete-coupon-dialog'
import { TablePagination } from '@/components/table-pagination'

const PAGE_SIZE = 10

export function CouponsContent() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<ICouponDataType | null>(
    null,
  )

  const {
    data: couponsData,
    isLoading,
    isError,
  } = useAdminCouponsQuery({
    page,
    limit: pageSize,
    search: searchQuery || undefined,
  })

  const couponsResult = couponsData as
    | IApiPaginationResponseWrapperType<ICouponDataType>
    | undefined
  const coupons: ICouponDataType[] = couponsResult?.data?.items ?? []
  const totalCount: number = couponsResult?.data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleEdit = (coupon: ICouponDataType) => {
    setSelectedCoupon(coupon)
    setEditDialogOpen(true)
  }

  const handleDelete = (coupon: ICouponDataType) => {
    setSelectedCoupon(coupon)
    setDeleteDialogOpen(true)
  }

  // Get fresh selected coupon data from cache
  const currentSelectedCoupon = selectedCoupon
    ? (coupons.find((c) => c.id === selectedCoupon.id) ?? selectedCoupon)
    : null

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 w-full min-w-0">
      <CouponsHeader
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onAddCoupon={() => setCreateDialogOpen(true)}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center justify-center py-20 text-destructive w-full">
          Lỗi khi tải danh sách mã giảm giá. Vui lòng thử lại.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && coupons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full">
          <Ticket className="h-12 w-12" />
          <p className="text-lg font-medium">Chưa có mã giảm giá nào</p>
          <p className="text-sm">
            Nhấn &ldquo;Thêm mã giảm giá&rdquo; để tạo mã đầu tiên
          </p>
        </div>
      )}

      {/* Coupons Table */}
      {!isLoading && !isError && coupons.length > 0 && (
        <div className="flex flex-col gap-4 flex-1 min-h-0 w-full overflow-hidden">
          <CouponTable
            coupons={coupons}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="shrink-0">
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalCount}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
              ariaLabel="Điều hướng phân trang mã giảm giá"
            />
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CreateCouponDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditCouponDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        coupon={currentSelectedCoupon}
      />

      <DeleteCouponDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        coupon={currentSelectedCoupon}
      />
    </div>
  )
}
