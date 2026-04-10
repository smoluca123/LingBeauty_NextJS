import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBlogCommentClientAPI,
  updateBlogCommentClientAPI,
  deleteBlogCommentClientAPI,
  createBlogCommentReportClientAPI,
} from '@/lib/apis/client/blog-comment.apis'
import type {
  ICreateBlogCommentPayload,
  IUpdateBlogCommentPayload,
  ICreateBlogCommentReportPayload,
  IBlogCommentDataType,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

// ── Create Comment ────────────────────────────────────────────────────────────

export const useCreateBlogCommentMutation = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBlogCommentPayload) =>
      createBlogCommentClientAPI(data),
    onSuccess: (response) => {
      const newComment = response.data

      // Update infinite query data - prepend new comment to the first page
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            // Match infinite queries for this post
            if (
              key[0] === 'blog-comments' &&
              key[1] === 'infinite' &&
              key[2] &&
              typeof key[2] === 'object'
            ) {
              const params = key[2] as Record<string, unknown>
              return params.postId === postId
            }
            return false
          },
        },
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          // Add new comment to the first page
          const firstPage = {
            ...oldData.pages[0],
            data: {
              ...oldData.pages[0].data,
              items: [newComment, ...oldData.pages[0].data.items],
              totalCount: oldData.pages[0].data.totalCount + 1,
            },
          }

          return {
            ...oldData,
            pages: [firstPage, ...oldData.pages.slice(1)],
          }
        },
      )

      toast.success('Bình luận thành công')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Bình luận thất bại')
    },
  })
}

// ── Update Comment ────────────────────────────────────────────────────────────

export const useUpdateBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: IUpdateBlogCommentPayload
    }) => updateBlogCommentClientAPI(id, data),
    onSuccess: (response, variables) => {
      const updatedComment = response.data

      // Update infinite query data - update the comment in matching pages only
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          // Check if this comment exists in this query
          const commentExists = oldData.pages.some((page) =>
            page.data.items.some((comment) => comment.id === variables.id),
          )

          // Only update if the comment exists in this query
          if (!commentExists) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((comment) =>
                  comment.id === variables.id ? updatedComment : comment,
                ),
              },
            })),
          }
        },
      )

      toast.success('Cập nhật bình luận thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật bình luận thất bại',
      )
    },
  })
}

// ── Delete Comment ────────────────────────────────────────────────────────────

export const useDeleteBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogCommentClientAPI(id),
    onSuccess: (_, commentId) => {
      // Update infinite query data - remove the comment from matching pages only
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          // Check if this comment exists in this query
          const commentExists = oldData.pages.some((page) =>
            page.data.items.some((comment) => comment.id === commentId),
          )

          // Only update if the comment exists in this query
          if (!commentExists) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (comment) => comment.id !== commentId,
                ),
                totalCount: Math.max(0, page.data.totalCount - 1),
              },
            })),
          }
        },
      )

      toast.success('Xóa bình luận thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa bình luận thất bại',
      )
    },
  })
}

// ── Report Comment ────────────────────────────────────────────────────────────

export const useReportBlogCommentMutation = () => {
  return useMutation({
    mutationFn: (data: ICreateBlogCommentReportPayload) =>
      createBlogCommentReportClientAPI(data),
    onSuccess: () => {
      toast.success('Báo cáo bình luận thành công')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Báo cáo thất bại')
    },
  })
}
