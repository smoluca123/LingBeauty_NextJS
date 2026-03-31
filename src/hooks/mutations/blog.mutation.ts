import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBlogPostClientAPI,
  updateBlogPostClientAPI,
  deleteBlogPostClientAPI,
  uploadBlogPostFeaturedImageClientAPI,
  createBlogTopicClientAPI,
  updateBlogTopicClientAPI,
  deleteBlogTopicClientAPI,
} from '@/lib/apis/client/blog.apis'
import {
  blogPostQueryKeys,
  blogTopicQueryKeys,
} from '@/hooks/querys/blog.query'
import type {
  ICreateBlogPostPayload,
  IUpdateBlogPostPayload,
  ICreateBlogTopicPayload,
  IUpdateBlogTopicPayload,
} from '@/lib/types/interfaces/apis/blog.interfaces'

// ============ Blog Post Mutations ============

export const useCreateBlogPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ICreateBlogPostPayload) => {
      const { featuredImage, ...postData } = data
      const response = await createBlogPostClientAPI(postData)

      if (featuredImage && response.data) {
        await uploadBlogPostFeaturedImageClientAPI(
          response.data.id,
          featuredImage,
        )
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostQueryKeys.all })
      toast.success('Tạo bài viết thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo bài viết thất bại',
      )
    },
  })
}

export const useUpdateBlogPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: IUpdateBlogPostPayload
    }) => {
      const { featuredImage, ...postData } = data
      const response = await updateBlogPostClientAPI(id, postData)

      if (featuredImage) {
        await uploadBlogPostFeaturedImageClientAPI(id, featuredImage)
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostQueryKeys.all })
      toast.success('Cập nhật bài viết thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật bài viết thất bại',
      )
    },
  })
}

export const useDeleteBlogPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogPostClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostQueryKeys.all })
      toast.success('Xóa bài viết thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa bài viết thất bại',
      )
    },
  })
}

// ============ Blog Topic Mutations ============

export const useCreateBlogTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBlogTopicPayload) =>
      createBlogTopicClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogTopicQueryKeys.all })
      toast.success('Tạo chủ đề thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo chủ đề thất bại',
      )
    },
  })
}

export const useUpdateBlogTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateBlogTopicPayload }) =>
      updateBlogTopicClientAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogTopicQueryKeys.all })
      toast.success('Cập nhật chủ đề thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật chủ đề thất bại',
      )
    },
  })
}

export const useDeleteBlogTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogTopicClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogTopicQueryKeys.all })
      toast.success('Xóa chủ đề thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa chủ đề thất bại',
      )
    },
  })
}
