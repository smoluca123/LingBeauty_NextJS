import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBlogTopicClientAPI,
  createSubTopicClientAPI,
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
  BlogTopicFormValues,
  BlogPostFormValues,
} from '@/lib/schemas/blog.schema'

// ── Blog Topic Mutations ───────────────────────────────────────────────────────

export const useCreateBlogTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BlogTopicFormValues) => {
      const { image, ...topicData } = data

      // Tạo topic trước
      const response = await createBlogTopicClientAPI(topicData)

      return { response, image }
    },
    onSuccess: async ({ response, image }) => {
      // Upload ảnh sau khi tạo topic thành công (nếu có)
      if (image && response.data) {
        const formData = new FormData()
        formData.append('file', image)
        await uploadTopicImageClientAPI(response.data.id, formData)
      }

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

export const useCreateSubTopicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      parentId,
      data,
    }: {
      parentId: string
      data: BlogTopicFormValues
    }) => {
      const { image, ...topicData } = data

      // Tạo sub-topic trước
      const response = await createSubTopicClientAPI(parentId, topicData)

      return { response, image }
    },
    onSuccess: async ({ response, image }) => {
      // Upload ảnh sau khi tạo sub-topic thành công (nếu có)
      if (image && response.data) {
        const formData = new FormData()
        formData.append('file', image)
        await uploadTopicImageClientAPI(response.data.id, formData)
      }

      queryClient.invalidateQueries({ queryKey: blogQueryKeys.topics })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicTopics })
      toast.success('Tạo chủ đề con thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo chủ đề con thất bại',
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
      data: BlogTopicFormValues
    }) => {
      const { image, ...topicData } = data

      // Update topic trước
      const response = await updateBlogTopicClientAPI(id, topicData)

      return { response, image, id }
    },
    onSuccess: async ({ image, id }) => {
      // Upload ảnh mới sau khi update topic thành công (nếu có)
      if (image) {
        const formData = new FormData()
        formData.append('file', image)
        await uploadTopicImageClientAPI(id, formData)
      }

      queryClient.invalidateQueries({ queryKey: blogQueryKeys.topics })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicTopics })
      queryClient.invalidateQueries({
        queryKey: blogQueryKeys.topicById(id),
      })
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
    mutationFn: async (data: BlogPostFormValues) => {
      const { featuredImage, ...postData } = data

      // Tạo post trước
      const response = await createBlogPostClientAPI(postData)

      return { response, featuredImage }
    },
    onSuccess: async ({ response, featuredImage }) => {
      // Upload ảnh featured sau khi tạo post thành công (nếu có)
      if (featuredImage && response.data) {
        try {
          const formData = new FormData()
          formData.append('file', featuredImage)
          await uploadPostFeaturedImageClientAPI(response.data.id, formData)
        } catch (error) {
          console.error('Upload featured image failed:', error)
          toast.error(
            error instanceof Error
              ? error.message
              : 'Upload ảnh đại diện thất bại',
          )
        }
      }

      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicPosts })
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
      data: BlogPostFormValues
    }) => {
      const { featuredImage, ...postData } = data

      // Update post trước
      const response = await updateBlogPostClientAPI(id, postData)

      return { response, featuredImage, id }
    },
    onSuccess: async ({ featuredImage, id }) => {
      // Upload ảnh featured mới sau khi update post thành công (nếu có)
      if (featuredImage) {
        const formData = new FormData()
        formData.append('file', featuredImage)
        await uploadPostFeaturedImageClientAPI(id, formData)
      }

      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicPosts })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.postById(id) })
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
