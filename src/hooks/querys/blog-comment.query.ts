import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getBlogCommentsClientAPI,
  getBlogCommentByIdClientAPI,
} from '@/lib/apis/client/blog-comment.apis'
import type { IBlogCommentFilters } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const blogCommentQueryKeys = {
  all: ['blog-comments'] as const,
  list: (params: IBlogCommentFilters) =>
    ['blog-comments', 'list', params] as const,
  infinite: (params: Omit<IBlogCommentFilters, 'page'>) =>
    ['blog-comments', 'infinite', params] as const,
  detail: (id: string) => ['blog-comments', 'detail', id] as const,
}

// ── Get All Comments (Paginated) ──────────────────────────────────────────────

export const useBlogCommentsQuery = (params: IBlogCommentFilters = {}) =>
  useQuery({
    queryKey: blogCommentQueryKeys.list(params),
    queryFn: () => getBlogCommentsClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev,
  })

// ── Get All Comments (Infinite Scroll) ────────────────────────────────────────

export const useInfiniteBlogCommentsQuery = (
  params: Omit<IBlogCommentFilters, 'page'> = {},
) =>
  useInfiniteQuery({
    queryKey: blogCommentQueryKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      getBlogCommentsClientAPI({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextPage = lastPage.data.hasNextPage
      const currentPage = lastPage.data.currentPage
      return hasNextPage ? currentPage + 1 : undefined
    },
    staleTime: 1000 * 30,
  })

// ── Get Comment By ID ─────────────────────────────────────────────────────────

export const useBlogCommentByIdQuery = (id: string | null) =>
  useQuery({
    queryKey: blogCommentQueryKeys.detail(id ?? ''),
    queryFn: () => getBlogCommentByIdClientAPI(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
