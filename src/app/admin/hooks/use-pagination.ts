'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface UsePaginationOptions {
  /** Initial page number (default: 1) */
  initialPage?: number;
  /** Initial page size (default: 10) */
  initialPageSize?: number;
  /** Sync pagination state with URL query params (default: false) */
  syncWithUrl?: boolean;
  /** Query param name for page (default: 'page') */
  pageParam?: string;
  /** Query param name for page size (default: 'pageSize') */
  pageSizeParam?: string;
}

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * Reusable pagination hook with optional URL synchronization.
 *
 * All `useCallback` wrappers have been removed — the React Compiler
 * handles memoization natively.
 *
 * @example
 * // Basic usage (state only)
 * const { paginate, getPaginationProps } = usePagination();
 * const paginatedItems = paginate(items);
 *
 * @example
 * // With URL sync
 * const { paginate, getPaginationProps } = usePagination({
 *   syncWithUrl: true,
 *   initialPageSize: 20,
 * });
 */
export function usePagination(options?: UsePaginationOptions) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    syncWithUrl = false,
    pageParam = 'page',
    pageSizeParam = 'pageSize',
  } = options || {};

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Compute initial values from URL if syncWithUrl is enabled
  const computedInitialPage = (() => {
    if (!syncWithUrl || !searchParams) return initialPage;
    const urlPage = searchParams.get(pageParam);
    return urlPage ? parseInt(urlPage, 10) : initialPage;
  })();

  const computedInitialPageSize = (() => {
    if (!syncWithUrl || !searchParams) return initialPageSize;
    const urlPageSize = searchParams.get(pageSizeParam);
    return urlPageSize ? parseInt(urlPageSize, 10) : initialPageSize;
  })();

  const [currentPage, setCurrentPage] = useState(computedInitialPage);
  const [pageSize, setPageSize] = useState(computedInitialPageSize);

  // Update URL when pagination changes
  const updateUrl = (page: number, size: number) => {
    if (!syncWithUrl || !searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, page.toString());
    params.set(pageSizeParam, size.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    if (syncWithUrl) updateUrl(page, pageSize);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (syncWithUrl) updateUrl(1, size);
  };

  const resetPage = () => {
    onPageChange(1);
  };

  /** Paginate an array of items based on current page and page size */
  const paginate = <T,>(items: T[]) => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  };

  /** Get all props needed for the TablePagination component */
  const getPaginationProps = (totalItems: number): PaginationProps => ({
    currentPage,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    onPageChange,
    onPageSizeChange,
  });

  return {
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
    resetPage,
    paginate,
    getPaginationProps,
    setPage: setCurrentPage,
    setPageSize,
  };
}
