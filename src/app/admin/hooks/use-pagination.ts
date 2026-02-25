'use client';

import { useState, useCallback } from 'react';
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
 * Reusable pagination hook with optional URL synchronization
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
 *   initialPageSize: 20 
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
    if (syncWithUrl && searchParams) {
      const urlPage = searchParams.get(pageParam);
      return urlPage ? parseInt(urlPage, 10) : initialPage;
    }
    return initialPage;
  })();

  const computedInitialPageSize = (() => {
    if (syncWithUrl && searchParams) {
      const urlPageSize = searchParams.get(pageSizeParam);
      return urlPageSize ? parseInt(urlPageSize, 10) : initialPageSize;
    }
    return initialPageSize;
  })();

  const [currentPage, setCurrentPage] = useState(computedInitialPage);
  const [pageSize, setPageSize] = useState(computedInitialPageSize);

  // Update URL when pagination changes
  const updateUrl = useCallback(
    (page: number, size: number) => {
      if (!syncWithUrl || !searchParams) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set(pageParam, page.toString());
      params.set(pageSizeParam, size.toString());

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [syncWithUrl, searchParams, pageParam, pageSizeParam, router, pathname]
  );

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      if (syncWithUrl) {
        updateUrl(page, pageSize);
      }
    },
    [pageSize, syncWithUrl, updateUrl]
  );

  const onPageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when page size changes
      if (syncWithUrl) {
        updateUrl(1, size);
      }
    },
    [syncWithUrl, updateUrl]
  );

  const resetPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  /**
   * Paginate an array of items based on current page and page size
   */
  const paginate = useCallback(
    <T,>(items: T[]) => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return items.slice(start, end);
    },
    [currentPage, pageSize]
  );

  /**
   * Get all props needed for the TablePagination component
   */
  const getPaginationProps = useCallback(
    (totalItems: number): PaginationProps => ({
      currentPage,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      onPageChange,
      onPageSizeChange,
    }),
    [currentPage, pageSize, onPageChange, onPageSizeChange]
  );

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
