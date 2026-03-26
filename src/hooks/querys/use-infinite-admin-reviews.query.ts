'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllAdminReviewsClientAPI } from '@/lib/apis/client/admin-review.apis';
import type { IAdminReviewFilters } from '@/lib/types/interfaces/apis/review.interfaces';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const infiniteAdminReviewQueryKeys = {
  all: ['admin', 'reviews', 'infinite'] as const,
  list: (filters: Omit<IAdminReviewFilters, 'page' | 'limit'>) =>
    ['admin', 'reviews', 'infinite', 'list', filters] as const,
};

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 12;

// ── Infinite Query Hook ───────────────────────────────────────────────────────

export interface UseInfiniteAdminReviewsOptions {
  search?: string;
  isApproved?: boolean;
  rating?: number;
  sortBy?: IAdminReviewFilters['sortBy'];
  order?: IAdminReviewFilters['order'];
  pageSize?: number;
}

export const useInfiniteAdminReviews = (
  options: UseInfiniteAdminReviewsOptions = {},
) => {
  const {
    search,
    isApproved,
    rating,
    sortBy,
    order,
    pageSize = DEFAULT_PAGE_SIZE,
  } = options;

  // Build filter key for cache
  const filterKey: Record<string, unknown> = {
    search: search || '',
    isApproved: isApproved ?? '',
    rating: rating ?? '',
    sortBy: sortBy || '',
    order: order || '',
  };

  return useInfiniteQuery({
    queryKey: infiniteAdminReviewQueryKeys.list(
      filterKey as Omit<IAdminReviewFilters, 'page' | 'limit'>,
    ),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllAdminReviewsClientAPI({
        page: pageParam,
        limit: pageSize,
        search,
        isApproved,
        rating,
        sortBy,
        order,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      const { totalCount, currentPage, pageSize } = lastPage.data;
      const totalPages = Math.ceil(totalCount / pageSize);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 30, // 30 giây
  });
};
