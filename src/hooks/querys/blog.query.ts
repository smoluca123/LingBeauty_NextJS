import { useQuery } from '@tanstack/react-query'
import {
  getAllBlogPostsClientAPI,
  getBlogPostByIdClientAPI,
  getAllBlogTopicsClientAPI,
  getBlogTopicByIdClientAPI,
} from '@/lib/apis/client/blog.apis'
import type {
  IBlogPostFilters,
  IBlogTopicFilters,
} from '@/lib/types/interfaces/apis/blog.interfaces'

// ============ Query Keys ============

export const blogPostQueryKeys = {
  all: ['admin', 'blog-posts'] as const,
  list: (filters: IBlogPostFilters) =>
    ['admin', 'blog-posts', 'list', filters] as const,
  detail: (id: string) => ['admin', 'blog-posts', 'detail', id] as const,
}

export const blogTopicQueryKeys = {
  all: ['admin', 'blog-topics'] as const,
  list: (filters: IBlogTopicFilters) =>
    ['admin', 'blog-topics', 'list', filters] as const,
  detail: (id: string) => ['admin', 'blog-topics', 'detail', id] as const,
}

// ============ Blog Post Queries ============

export const useBlogPostsQuery = (filters: IBlogPostFilters = {}) =>
  useQuery({
    queryKey: blogPostQueryKeys.list(filters),
    queryFn: () => getAllBlogPostsClientAPI({ ...filters }),
    staleTime: 1000 * 30, // 30 seconds
  })

export const useBlogPostQuery = (id: string) =>
  useQuery({
    queryKey: blogPostQueryKeys.detail(id),
    queryFn: () => getBlogPostByIdClientAPI(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  })

// ============ Blog Topic Queries ============

export const useBlogTopicsQuery = (filters: IBlogTopicFilters = {}) =>
  useQuery({
    queryKey: blogTopicQueryKeys.list(filters),
    queryFn: () => getAllBlogTopicsClientAPI(filters),
    staleTime: 1000 * 60, // 1 minute
  })

export const useBlogTopicQuery = (id: string) =>
  useQuery({
    queryKey: blogTopicQueryKeys.detail(id),
    queryFn: () => getBlogTopicByIdClientAPI(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  })
