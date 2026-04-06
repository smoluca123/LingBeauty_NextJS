import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminUpdateBlogCommentClientAPI,
  adminDeleteBlogCommentClientAPI,
  updateBlogCommentReportStatusClientAPI,
} from '@/lib/apis/client/blog-comment.apis'
import { blogCommentQueryKeys } from '@/hooks/querys/blog-comment.query'
import type {
  IUpdateBlogCommentPayload,
  IUpdateBlogCommentReportStatusPayload,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const useAdminUpdateBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: IUpdateBlogCommentPayload
    }) => adminUpdateBlogCommentClientAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogCommentQueryKeys.adminAll })
      queryClient.invalidateQueries({ queryKey: blogCommentQueryKeys.all })
      toast.success('Cập nhật bình luận thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật bình luận thất bại',
      )
    },
  })
}

export const useAdminDeleteBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminDeleteBlogCommentClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogCommentQueryKeys.adminAll })
      queryClient.invalidateQueries({ queryKey: blogCommentQueryKeys.all })
      toast.success('Xóa bình luận thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa bình luận thất bại',
      )
    },
  })
}

export const useUpdateBlogCommentReportStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: IUpdateBlogCommentReportStatusPayload
    }) => updateBlogCommentReportStatusClientAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogCommentQueryKeys.reports })
      toast.success('Cập nhật trạng thái báo cáo thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật trạng thái báo cáo thất bại',
      )
    },
  })
}
