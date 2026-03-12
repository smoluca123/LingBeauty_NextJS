'use client';

import { useState, useEffect, useRef } from 'react';
import { ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/app/admin/components';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { InventoryRow } from './inventory-table';
import { InventoryTable } from './inventory-table';
import { InventorySearchFilters } from './inventory-search-filters';
import { InventoryEmptyState } from './inventory-empty-state';
import { InventoryLoading } from './inventory-loading';
import { AdjustInventoryDialog } from './adjust-inventory-dialog';
import { BulkAdjustDialog } from './bulk-adjust-dialog';
import type { StatusFilter } from './inventory-search-filters';

// ============ Types ============

type QueryHookFn = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
) => {
  data: unknown;
  isLoading: boolean;
};

interface InventoryTabLayoutProps {
  /** The query hook that fetches paginated data */
  useQuery: QueryHookFn;
  /** Whether search input is debounced server-side (true) or client-side filtered (false) */
  serverSearch?: boolean;
  /** Whether the status filter dropdown should be shown */
  showStatusFilter?: boolean;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Aria label for the search input */
  searchAriaLabel?: string;
  /** Message when no items found */
  emptyTitle?: string;
  /** Sub-message when no items found (no active filters) */
  emptyDescription?: string;
  /** Sub-message when no items found (with active filters) */
  emptyFilteredDescription?: string;
  /** Aria label for pagination */
  paginationAriaLabel?: string;
}

// ============ Constants ============

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

// ============ Component ============

export function InventoryTabLayout({
  useQuery,
  serverSearch = false,
  showStatusFilter = false,
  searchPlaceholder = 'Tìm theo tên, SKU…',
  searchAriaLabel = 'Tìm kiếm kho hàng',
  emptyTitle = 'Không có dữ liệu',
  emptyDescription = 'Chưa có dữ liệu kho hàng.',
  emptyFilteredDescription = 'Không tìm thấy kết quả phù hợp. Thử thay đổi điều kiện lọc.',
  paginationAriaLabel = 'Phân trang kho hàng',
}: InventoryTabLayoutProps) {
  // ── Pagination & filter state ─────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryRow | null>(null);

  // ── Debounce search (only for server-side search tabs) ────────────────────
  useEffect(() => {
    if (!serverSearch) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchInput, serverSearch]);

  // ── Query ─────────────────────────────────────────────────────────────────
  const serverStatus = statusFilter === 'all' ? undefined : statusFilter;
  const querySearch = serverSearch ? debouncedSearch || undefined : undefined;

  const { data, isLoading } = useQuery(page, limit, querySearch, serverStatus);
  const paginatedData = data as IApiPaginationResponseWrapperType<InventoryRow> | undefined;

  // ── Derived data ──────────────────────────────────────────────────────────
  const rawItems: InventoryRow[] = paginatedData?.data?.items ?? [];
  const totalCount = paginatedData?.data?.totalCount ?? 0;
  const totalPage = paginatedData?.data?.totalPage ?? 1;

  // ── Client-side search (for filtered tabs without server search) ──────────
  const items = serverSearch ? rawItems : filterItemsBySearch(rawItems, searchInput);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (!serverSearch) setPage(1);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setLimit(size);
    setPage(1);
  };

  const handleAdjust = (item: InventoryRow) => {
    setSelectedItem(item);
    setAdjustOpen(true);
  };

  const hasActiveFilters = searchInput.trim() !== '' || statusFilter !== 'all';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-3">
      {/* Filters + Bulk action */}
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <InventorySearchFilters
            search={searchInput}
            onSearchChange={handleSearchChange}
            searchPlaceholder={searchPlaceholder}
            searchAriaLabel={searchAriaLabel}
            statusFilter={showStatusFilter ? statusFilter : undefined}
            onStatusChange={showStatusFilter ? handleStatusChange : undefined}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => setBulkOpen(true)}
          disabled={items.length === 0}
        >
          <ListFilter className="h-4 w-4 mr-2" />
          Điều chỉnh hàng loạt
        </Button>
      </div>

      {/* Table area */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <InventoryLoading />
        ) : items.length === 0 ? (
          <InventoryEmptyState
            title={emptyTitle}
            description={hasActiveFilters ? emptyFilteredDescription : emptyDescription}
          />
        ) : (
          <InventoryTable inventory={items} onAdjust={handleAdjust} />
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          currentPage={page}
          totalPages={totalPage}
          pageSize={limit}
          totalItems={totalCount}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
          ariaLabel={paginationAriaLabel}
        />
      </div>

      {/* Dialogs */}
      <AdjustInventoryDialog open={adjustOpen} onOpenChange={setAdjustOpen} item={selectedItem} />
      <BulkAdjustDialog open={bulkOpen} onOpenChange={setBulkOpen} items={items} />
    </div>
  );
}

// ============ Helpers ============

function filterItemsBySearch(items: InventoryRow[], search: string): InventoryRow[] {
  const query = search.trim().toLowerCase();
  if (!query) return items;

  return items.filter(
    (item) =>
      item.product?.name?.toLowerCase().includes(query) ||
      item.product?.sku?.toLowerCase().includes(query),
  );
}
