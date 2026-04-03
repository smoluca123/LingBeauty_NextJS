import { useQuery } from '@tanstack/react-query'
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
  detail: (id: string) => ['blog-comments', 'detail', id] as const,
}

// ── Get All Comments ──────────────────────────────────────────────────────────

export const useBlogCommentsQuery = (params: IBlogCommentFilters = {}) =>
  useQuery({
    queryKey: blogCommentQueryKeys.list(params),
    queryFn: () => getBlogCommentsClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev,
  })

// ── Get Comment By ID ─────────────────────────────────────────────────────────

export const useBlogCommentByIdQuery = (id: string | null) =>
  useQuery({
    queryKey: blogCommentQueryKeys.detail(id ?? ''),
    queryFn: () => getBlogCommentByIdClientAPI(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
