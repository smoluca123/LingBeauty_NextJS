import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBlogTopicClientAPI,
  updateBlogTopicClientAPI,
  deleteBlogTopicClientAPI,
  uploadTopicImageClientAPI,
  createBlogPostClientAPI,
  updateBlogPostClientAPI,
  deleteBlogPostClientAPI,
  uploadPostFeaturedImageClientAPI,
} from '@/lib/apis/client/blog.apis'
import { blogQueryKeys } from '@/hooks/querys/blog.query'
import type {
  ICreateBlogTopicPayload,
  IUpdateBlogTopicPayload,
  ICreateBlogPostPayload,
  IUpdateBlogPostPayload,
} from '@/lib/types/interfaces/apis/blog.interfaces'

// ── Blog Topic Mutations ───────────────────────────────────────────────────────

export const useCreateBlogTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBlogTopicPayload) =>
      createBlogTopicClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.topics })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicTopics })
      toast.success('Tạo chủ đề blog thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo chủ đề blog thất bại',
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
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.topics })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicTopics })
      toast.success('Cập nhật chủ đề blog thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật chủ đề blog thất bại',
      )
    },
  })
}

export const useDeleteBlogTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogTopicClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.topics })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicTopics })
      toast.success('Xóa chủ đề blog thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa chủ đề blog thất bại',
      )
    },
  })
}

export const useUploadTopicImageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      uploadTopicImageClientAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.topics })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicTopics })
      toast.success('Upload ảnh chủ đề thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Upload ảnh thất bại',
      )
    },
  })
}

// ── Blog Post Mutations ────────────────────────────────────────────────────────

export const useCreateBlogPostMutation = () => {
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
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicPosts })
      toast.success('Xóa bài viết thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa bài viết thất bại',
      )
    },
  })
}

export const useUploadPostFeaturedImageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      uploadPostFeaturedImageClientAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicPosts })
      toast.success('Upload ảnh bài viết thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Upload ảnh thất bại',
      )
    },
  })
}
