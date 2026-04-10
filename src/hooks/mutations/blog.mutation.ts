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
import type {
  IBlogTopicDataType,
  IBlogPostDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

// ── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Helper to upload image with error handling
 */
const uploadImageWithErrorHandling = async (
  entityId: string,
  image: File,
  uploadFn: (id: string, formData: FormData) => Promise<any>,
): Promise<{ id: string; url: string; type: string } | null> => {
  try {
    const formData = new FormData()
    formData.append('file', image)
    const response = await uploadFn(entityId, formData)
    return response.data.imageMedia || response.data.featuredImage || null
  } catch (error) {
    console.error('Upload image failed:', error)
    toast.error(error instanceof Error ? error.message : 'Upload ảnh thất bại')
    return null
  }
}

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
      let newTopic = response.data

      // Upload ảnh sau khi tạo topic thành công (nếu có)
      if (image && newTopic) {
        const imageMedia = await uploadImageWithErrorHandling(
          newTopic.id,
          image,
          uploadTopicImageClientAPI,
        )
        if (imageMedia) {
          newTopic = { ...newTopic, imageMedia }
        }
      }

      // Add to all topic list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogTopicDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-topics'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newTopic, ...oldData.data.items],
              totalCount: oldData.data.totalCount + 1,
            },
          }
        },
      )

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

      return { response, image, parentId }
    },
    onSuccess: async ({ response, image }) => {
      let newSubTopic = response.data

      // Upload ảnh sau khi tạo sub-topic thành công (nếu có)
      if (image && newSubTopic) {
        const imageMedia = await uploadImageWithErrorHandling(
          newSubTopic.id,
          image,
          uploadTopicImageClientAPI,
        )
        if (imageMedia) {
          newSubTopic = { ...newSubTopic, imageMedia }
        }
      }

      // Add to all topic list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogTopicDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-topics'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newSubTopic, ...oldData.data.items],
              totalCount: oldData.data.totalCount + 1,
            },
          }
        },
      )

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
    onSuccess: async ({ response, image, id }) => {
      let updatedTopic = response.data

      // Upload ảnh mới sau khi update topic thành công (nếu có)
      if (image) {
        const imageMedia = await uploadImageWithErrorHandling(
          id,
          image,
          uploadTopicImageClientAPI,
        )
        if (imageMedia) {
          updatedTopic = { ...updatedTopic, imageMedia }
        }
      }

      // Update in all topic list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogTopicDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-topics'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((topic) =>
                topic.id === id ? updatedTopic : topic,
              ),
            },
          }
        },
      )

      // Update single topic query
      queryClient.setQueryData(blogQueryKeys.topicById(id), (old: any) => {
        if (!old?.data) return old
        return { ...old, data: updatedTopic }
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
    onMutate: async (topicId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-topics'
        },
      })

      // Snapshot previous values
      const previousData = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IBlogTopicDataType>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-topics'
        },
      })

      // Optimistically remove from all topic queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogTopicDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-topics'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((topic) => topic.id !== topicId),
              totalCount: Math.max(0, oldData.data.totalCount - 1),
            },
          }
        },
      )

      return { previousData }
    },
    onSuccess: (_response, topicId) => {
      // Remove single topic query
      queryClient.removeQueries({ queryKey: blogQueryKeys.topicById(topicId) })
      toast.success('Xóa chủ đề blog thành công')
    },
    onError: (error, _topicId, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
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
    onSuccess: (response, { id }) => {
      const imageMedia = response.data.imageMedia

      // Update in all topic list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogTopicDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-topics'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((topic) =>
                topic.id === id ? { ...topic, imageMedia } : topic,
              ),
            },
          }
        },
      )

      // Update single topic query
      queryClient.setQueryData(blogQueryKeys.topicById(id), (old: any) => {
        if (!old?.data) return old
        return { ...old, data: { ...old.data, imageMedia } }
      })

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
      let newPost = response.data

      // Upload ảnh featured sau khi tạo post thành công (nếu có)
      if (featuredImage && newPost) {
        const featuredImageMedia = await uploadImageWithErrorHandling(
          newPost.id,
          featuredImage,
          uploadPostFeaturedImageClientAPI,
        )
        if (featuredImageMedia) {
          newPost = { ...newPost, featuredImage: featuredImageMedia }
        }
      }

      // Add to all post list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogPostDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-posts'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newPost, ...oldData.data.items],
              totalCount: oldData.data.totalCount + 1,
            },
          }
        },
      )

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
    onSuccess: async ({ response, featuredImage, id }) => {
      let updatedPost = response.data

      // Upload ảnh featured mới sau khi update post thành công (nếu có)
      if (featuredImage) {
        const featuredImageMedia = await uploadImageWithErrorHandling(
          id,
          featuredImage,
          uploadPostFeaturedImageClientAPI,
        )
        if (featuredImageMedia) {
          updatedPost = { ...updatedPost, featuredImage: featuredImageMedia }
        }
      }

      // Update in all post list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogPostDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-posts'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((post) =>
                post.id === id ? updatedPost : post,
              ),
            },
          }
        },
      )

      // Update single post query
      queryClient.setQueryData(blogQueryKeys.postById(id), (old: any) => {
        if (!old?.data) return old
        return { ...old, data: updatedPost }
      })

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
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-posts'
        },
      })

      // Snapshot previous values
      const previousData = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IBlogPostDataType>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-posts'
        },
      })

      // Optimistically remove from all post queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogPostDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-posts'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((post) => post.id !== postId),
              totalCount: Math.max(0, oldData.data.totalCount - 1),
            },
          }
        },
      )

      return { previousData }
    },
    onSuccess: (_response, postId) => {
      // Remove single post query
      queryClient.removeQueries({ queryKey: blogQueryKeys.postById(postId) })
      toast.success('Xóa bài viết thành công')
    },
    onError: (error, _postId, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
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
    onSuccess: (response, { id }) => {
      const featuredImage = response.data.featuredImage

      // Update in all post list queries
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IBlogPostDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-posts'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((post) =>
                post.id === id ? { ...post, featuredImage } : post,
              ),
            },
          }
        },
      )

      // Update single post query
      queryClient.setQueryData(blogQueryKeys.postById(id), (old: any) => {
        if (!old?.data) return old
        return { ...old, data: { ...old.data, featuredImage } }
      })

      toast.success('Upload ảnh bài viết thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Upload ảnh thất bại',
      )
    },
  })
}
