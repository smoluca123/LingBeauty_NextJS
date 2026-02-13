'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  /** Optional label for screen readers */
  ariaLabel?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  ariaLabel = 'Điều hướng phân trang',
}: TablePaginationProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4"
      aria-label={ariaLabel}
      role="navigation"
    >
      {/* Items info - Announced by screen readers */}
      <div
        className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 w-full sm:w-auto text-center sm:text-left"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {totalItems > 0 ? (
          <>
            <span className="hidden sm:inline">Hiển thị </span>
            {startItem}–{endItem} <span className="hidden xs:inline">/</span>
            <span className="xs:hidden"> trong </span>
            {totalItems} <span className="hidden sm:inline">mục</span>
          </>
        ) : (
          'Không có dữ liệu'
        )}
      </div>

      <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="page-size-select"
            className="text-xs sm:text-sm text-muted-foreground hidden sm:inline whitespace-nowrap"
          >
            Hiển thị
          </label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              id="page-size-select"
              className="h-9 sm:h-11 w-14 sm:w-16 touch-action-manipulation text-xs sm:text-sm"
              aria-label="Chọn số mục trên mỗi trang"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline whitespace-nowrap">
            / trang
          </span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1" role="group" aria-label="Điều hướng trang">
          {/* First page button - Hidden on mobile */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 sm:h-11 sm:w-11 touch-action-manipulation hidden md:inline-flex"
            onClick={() => onPageChange(1)}
            disabled={isFirstPage}
            aria-label="Đi đến trang đầu tiên"
            aria-disabled={isFirstPage}
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          
          {/* Previous page button */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 sm:h-11 sm:w-11 touch-action-manipulation"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            aria-label="Đi đến trang trước"
            aria-disabled={isFirstPage}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Page indicator */}
          <span
            className="text-xs sm:text-sm px-2 sm:px-3 min-w-14 sm:min-w-16 text-center tabular-nums font-medium"
            aria-current="page"
            aria-label={`Trang ${currentPage} trong tổng số ${totalPages} trang`}
          >
            {currentPage} / {totalPages}
          </span>

          {/* Next page button */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 sm:h-11 sm:w-11 touch-action-manipulation"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            aria-label="Đi đến trang sau"
            aria-disabled={isLastPage}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          
          {/* Last page button - Hidden on mobile */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 sm:h-11 sm:w-11 touch-action-manipulation hidden md:inline-flex"
            onClick={() => onPageChange(totalPages)}
            disabled={isLastPage}
            aria-label="Đi đến trang cuối cùng"
            aria-disabled={isLastPage}
          >
            <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
