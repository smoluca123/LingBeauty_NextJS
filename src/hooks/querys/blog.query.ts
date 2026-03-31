import { useQuery } from '@tanstack/react-query'
import {
  getAllBlogTopicsClientAPI,
  getAllBlogPostsClientAPI,
  getPublicBlogTopicsClientAPI,
  getPublicBlogPostsClientAPI,
  getPublicBlogTopicBySlugClientAPI,
  getPublicBlogPostBySlugClientAPI,
} from '@/lib/apis/client/blog.apis'
import type {
  IBlogTopicFilters,
  IBlogPostFilters,
} from '@/lib/types/interfaces/apis/blog.interfaces'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const blogQueryKeys = {
  // Admin keys
  topics: ['admin', 'blog-topics'] as const,
  topicsList: (params: IBlogTopicFilters) =>
    ['admin', 'blog-topics', 'list', params] as const,
  posts: ['admin', 'blog-posts'] as const,
  postsList: (params: IBlogPostFilters) =>
    ['admin', 'blog-posts', 'list', params] as const,

  // Public keys
  publicTopics: ['public', 'blog-topics'] as const,
  publicTopicsList: (params: IBlogTopicFilters) =>
    ['public', 'blog-topics', 'list', params] as const,
  publicTopicBySlug: (slug: string) =>
    ['public', 'blog-topics', 'slug', slug] as const,
  publicPosts: ['public', 'blog-posts'] as const,
  publicPostsList: (params: IBlogPostFilters) =>
    ['public', 'blog-posts', 'list', params] as const,
  publicPostBySlug: (slug: string) =>
    ['public', 'blog-posts', 'slug', slug] as const,
}

// ── Admin Blog Topics ──────────────────────────────────────────────────────────

export const useBlogTopicsQuery = (params: IBlogTopicFilters = {}) =>
  useQuery({
    queryKey: blogQueryKeys.topicsList(params),
    queryFn: () => getAllBlogTopicsClientAPI(params),
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: (prev) => prev,
  })

// ── Admin Blog Posts ───────────────────────────────────────────────────────────

export const useBlogPostsQuery = (params: IBlogPostFilters = {}) =>
  useQuery({
    queryKey: blogQueryKeys.postsList(params),
    queryFn: () => getAllBlogPostsClientAPI(params),
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: (prev) => prev,
  })

// ── Public Blog Topics ─────────────────────────────────────────────────────────

export const usePublicBlogTopicsQuery = (params: IBlogTopicFilters = {}) =>
  useQuery({
    queryKey: blogQueryKeys.publicTopicsList(params),
    queryFn: () => getPublicBlogTopicsClientAPI(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  })

export const usePublicBlogTopicBySlugQuery = (slug: string | null) =>
  useQuery({
    queryKey: blogQueryKeys.publicTopicBySlug(slug ?? ''),
    queryFn: () => getPublicBlogTopicBySlugClientAPI(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

// ── Public Blog Posts ──────────────────────────────────────────────────────────

export const usePublicBlogPostsQuery = (params: IBlogPostFilters = {}) =>
  useQuery({
    queryKey: blogQueryKeys.publicPostsList(params),
    queryFn: () => getPublicBlogPostsClientAPI(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  })

export const usePublicBlogPostBySlugQuery = (slug: string | null) =>
  useQuery({
    queryKey: blogQueryKeys.publicPostBySlug(slug ?? ''),
    queryFn: () => getPublicBlogPostBySlugClientAPI(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
