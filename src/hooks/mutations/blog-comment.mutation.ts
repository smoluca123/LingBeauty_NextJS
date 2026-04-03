import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { blogCommentQueryKeys } from '@/hooks/querys/blog-comment.query'
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
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

// ── Create Comment ────────────────────────────────────────────────────────────

export const useCreateBlogCommentMutation = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBlogCommentPayload) =>
      createBlogCommentClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.list({ postId }),
      })
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.detail(variables.id),
      })
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.all,
      })
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
