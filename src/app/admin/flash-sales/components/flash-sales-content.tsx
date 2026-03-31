'use client'

import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { useAdminFlashSalesQuery } from '@/hooks/querys/admin-flash-sale.query'
import type { IFlashSaleDataType } from '@/lib/types/interfaces/apis/flash-sale.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { FlashSalesHeader } from './flash-sales-header'
import { FlashSaleTable } from './flash-sale-table'
import { CreateFlashSaleDialog } from './create-flash-sale-dialog'
import { EditFlashSaleDialog } from './edit-flash-sale-dialog'
import { DeleteFlashSaleDialog } from './delete-flash-sale-dialog'
import { ManageProductsDialog } from './manage-products-dialog'
import { TablePagination } from '@/components/table-pagination'
import { FLASH_SALE_PAGE_SIZE } from '@/app/admin/flash-sales/constants'

export function FlashSalesContent() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(FLASH_SALE_PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [manageProductsOpen, setManageProductsOpen] = useState(false)
  const [selectedFlashSale, setSelectedFlashSale] =
    useState<IFlashSaleDataType | null>(null)

  const {
    data: flashSalesData,
    isLoading,
    isError,
  } = useAdminFlashSalesQuery({
    page,
    limit: pageSize,
    search: searchQuery || undefined,
  })

  const flashSalesResult = flashSalesData as
    | IApiPaginationResponseWrapperType<IFlashSaleDataType>
    | undefined
  const flashSales: IFlashSaleDataType[] = flashSalesResult?.data?.items ?? []
  const totalCount: number = flashSalesResult?.data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleEdit = (flashSale: IFlashSaleDataType) => {
    setSelectedFlashSale(flashSale)
    setEditDialogOpen(true)
  }

  const handleDelete = (flashSale: IFlashSaleDataType) => {
    setSelectedFlashSale(flashSale)
    setDeleteDialogOpen(true)
  }

  const handleManageProducts = (flashSale: IFlashSaleDataType) => {
    setSelectedFlashSale(flashSale)
    setManageProductsOpen(true)
  }

  // Get fresh selected flash sale data from cache
  const currentSelectedFlashSale = selectedFlashSale
    ? (flashSales.find((fs) => fs.id === selectedFlashSale.id) ??
      selectedFlashSale)
    : null

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 w-full min-w-0">
      <FlashSalesHeader
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onAddFlashSale={() => setCreateDialogOpen(true)}
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
          Lỗi khi tải danh sách flash sale. Vui lòng thử lại.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && flashSales.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full">
          <Zap className="h-12 w-12" />
          <p className="text-lg font-medium">Chưa có flash sale nào</p>
          <p className="text-sm">
            Nhấn &ldquo;Thêm Flash Sale&rdquo; để tạo đợt giảm giá đầu tiên
          </p>
        </div>
      )}

      {/* Flash Sales Table */}
      {!isLoading && !isError && flashSales.length > 0 && (
        <div className="flex flex-col gap-4 flex-1 min-h-0 w-full overflow-hidden">
          <FlashSaleTable
            flashSales={flashSales}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageProducts={handleManageProducts}
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
              ariaLabel="Điều hướng phân trang flash sale"
            />
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CreateFlashSaleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditFlashSaleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        flashSale={currentSelectedFlashSale}
      />

      <DeleteFlashSaleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        flashSale={currentSelectedFlashSale}
      />

      {currentSelectedFlashSale && (
        <ManageProductsDialog
          open={manageProductsOpen}
          onOpenChange={setManageProductsOpen}
          flashSale={currentSelectedFlashSale}
        />
      )}
    </div>
  )
}
