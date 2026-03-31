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
  uploadBlogTopicImageClientAPI,
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
    mutationFn: async (data: ICreateBlogTopicPayload) => {
      const { image, ...topicData } = data

      // Phân loại API: có parentId thì gọi API tạo sub-topic, không có thì gọi API tạo topic chính
      const response = await createBlogTopicClientAPI(topicData)

      return { response, image }
    },
    onSuccess: async ({ response, image }) => {
      // Upload ảnh sau khi tạo topic thành công (nếu có)
      if (image && response.data) {
        await uploadBlogTopicImageClientAPI(response.data.id, image)
      }

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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: IUpdateBlogTopicPayload
    }) => {
      const { image, ...topicData } = data
      const response = await updateBlogTopicClientAPI(id, topicData)

      return { response, image, id }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: async ({ response, image, id }) => {
      // Upload ảnh mới sau khi update topic thành công (nếu có)
      if (image) {
        await uploadBlogTopicImageClientAPI(id, image)
      }

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
