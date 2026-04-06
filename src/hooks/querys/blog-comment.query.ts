import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getBlogCommentsClientAPI,
  getBlogCommentByIdClientAPI,
  getAllAdminBlogCommentsClientAPI,
  getAllBlogCommentReportsClientAPI,
  getBlogCommentReportByIdClientAPI,
} from '@/lib/apis/client/blog-comment.apis'
import type {
  IBlogCommentFilters,
  IBlogCommentReportFilters,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

// ────────────────────────────────────────────────────────────────────────────────
// Query Keys
// ────────────────────────────────────────────────────────────────────────────────

export const blogCommentQueryKeys = {
  // Public keys
  all: ['blog-comments'] as const,
  list: (params: IBlogCommentFilters) =>
    ['blog-comments', 'list', params] as const,
  infinite: (params: Omit<IBlogCommentFilters, 'page'>) =>
    ['blog-comments', 'infinite', params] as const,
  detail: (id: string) => ['blog-comments', 'detail', id] as const,

  // Admin keys
  adminAll: ['admin', 'blog-comments'] as const,
  adminList: (params: IBlogCommentFilters) =>
    ['admin', 'blog-comments', 'list', params] as const,

  // Report keys
  reports: ['admin', 'blog-comment-reports'] as const,
  reportsList: (params: IBlogCommentReportFilters) =>
    ['admin', 'blog-comment-reports', 'list', params] as const,
  reportDetail: (id: string) =>
    ['admin', 'blog-comment-reports', 'detail', id] as const,
}

// ────────────────────────────────────────────────────────────────────────────────
// Public Blog Comment Queries
// ────────────────────────────────────────────────────────────────────────────────


export const useBlogCommentsQuery = (params: IBlogCommentFilters = {}) =>
  useQuery({
    queryKey: blogCommentQueryKeys.list(params),
    queryFn: () => getBlogCommentsClientAPI(params),
    staleTime: 1000 * 30,
  })

export const useBlogCommentByIdQuery = (id: string) =>
  useQuery({
    queryKey: blogCommentQueryKeys.detail(id),
    queryFn: () => getBlogCommentByIdClientAPI(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  })

// ────────────────────────────────────────────────────────────────────────────────
// Admin Blog Comment Queries
// ────────────────────────────────────────────────────────────────────────────────

export const useAdminBlogCommentsQuery = (params: IBlogCommentFilters = {}) =>
  useQuery({
    queryKey: blogCommentQueryKeys.adminList(params),
    queryFn: () => getAllAdminBlogCommentsClientAPI(params),
    staleTime: 1000 * 30,
  })

// ────────────────────────────────────────────────────────────────────────────────
// Admin Blog Comment Report Queries
// ────────────────────────────────────────────────────────────────────────────────

export const useBlogCommentReportsQuery = (
  params: IBlogCommentReportFilters = {},
) =>
  useQuery({
    queryKey: blogCommentQueryKeys.reportsList(params),
    queryFn: () => getAllBlogCommentReportsClientAPI(params),
    staleTime: 1000 * 30,
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

export const useBlogCommentReportByIdQuery = (id: string) =>
  useQuery({
    queryKey: blogCommentQueryKeys.reportDetail(id),
    queryFn: () => getBlogCommentReportByIdClientAPI(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
