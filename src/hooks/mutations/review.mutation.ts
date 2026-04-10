import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createReviewAPI,
  markHelpfulAPI,
  unmarkHelpfulAPI,
  createReviewReplyAPI,
  updateReviewAPI,
  deleteReviewAPI,
  updateReviewReplyAPI,
  deleteReviewReplyAPI,
} from '@/lib/apis/client/review.apis'
import {
  ICreateReviewDataType,
  ICreateReviewReplyDataType,
  IUpdateReviewDataType,
  IUpdateReviewReplyDataType,
  IReviewDataType,
  IReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces'
import { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import {
  getProductReviewSummaryQueryKey,
  getPublicReviewByIdQueryKey,
} from '@/hooks/querys/review.query'
import { toast } from 'sonner'

/**
 * Mutation hook to create a new review
 * Uses setQueriesData to add the new review to cache immediately
 */
export const useCreateReviewMutation = (productId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateReviewDataType) => createReviewAPI(data),
    onSuccess: (response) => {
      const newReview = response.data

      // Add new review to all review list queries for this product
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newReview, ...oldData.data.items],
              totalCount: oldData.data.totalCount + 1,
            },
          }
        },
      )

      // Invalidate review summary to recalculate stats (rating distribution, average)
      queryClient.invalidateQueries({
        queryKey: getProductReviewSummaryQueryKey(productId),
      })

      toast.success('Đánh giá của bạn đã được gửi thành công!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.')
    },
  })
}

/**
 * Mutation hook to mark a review as helpful
 * Uses setQueriesData with optimistic update
 */
export const useMarkHelpfulMutation = (reviewId: string, productId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markHelpfulAPI(reviewId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'reviews' && key[1] === productId
        },
      })

      // Snapshot previous values
      const previousData = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'reviews' && key[1] === productId
        },
      })

      // Optimistically update
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((review) =>
                review.id === reviewId
                  ? {
                      ...review,
                      helpfulCount: review.helpfulCount + 1,
                      hasMarked: true,
                    }
                  : review,
              ),
            },
          }
        },
      )

      return { previousData }
    },
    onSuccess: (response) => {
      const { helpfulCount } = response.data

      // Update with real data from server
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((review) =>
                review.id === reviewId
                  ? { ...review, helpfulCount, hasMarked: true }
                  : review,
              ),
            },
          }
        },
      )
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(error.message || 'Không thể đánh dấu hữu ích.')
    },
  })
}

/**
 * Mutation hook to unmark helpful from a review
 * Uses setQueriesData with optimistic update
 */
export const useUnmarkHelpfulMutation = (
  reviewId: string,
  productId: string,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => unmarkHelpfulAPI(reviewId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'reviews' && key[1] === productId
        },
      })

      // Snapshot previous values
      const previousData = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'reviews' && key[1] === productId
        },
      })

      // Optimistically update
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((review) =>
                review.id === reviewId
                  ? {
                      ...review,
                      helpfulCount: Math.max(0, review.helpfulCount - 1),
                      hasMarked: false,
                    }
                  : review,
              ),
            },
          }
        },
      )

      return { previousData }
    },
    onSuccess: (response) => {
      const { helpfulCount } = response.data

      // Update with real data from server
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((review) =>
                review.id === reviewId
                  ? { ...review, helpfulCount, hasMarked: false }
                  : review,
              ),
            },
          }
        },
      )
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(error.message || 'Không thể bỏ đánh dấu.')
    },
  })
}

/**
 * Mutation hook to create a reply to a review
 * Uses setQueriesData to prepend the new reply to the first page in the infinite query cache
 */
export const useCreateReviewReplyMutation = (reviewId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateReviewReplyDataType) =>
      createReviewReplyAPI(reviewId, data),
    onSuccess: (response) => {
      const newReply = response.data

      // Update infinite query data - prepend new reply to the first page
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IReviewReplyDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'review-replies' && key[1] === reviewId
          },
        },
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          // Add new reply to the first page
          const firstPage = {
            ...oldData.pages[0],
            data: {
              ...oldData.pages[0].data,
              items: [newReply, ...oldData.pages[0].data.items],
            },
          }

          return {
            ...oldData,
            pages: [firstPage, ...oldData.pages.slice(1)],
          }
        },
      )

      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể gửi phản hồi.')
    },
  })
}

/**
 * Mutation hook to update a review
 * Uses setQueryData to update the specific review in cache and invalidates related queries
 */
export const useUpdateReviewMutation = (
  reviewId: string,
  productId: string,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IUpdateReviewDataType) =>
      updateReviewAPI(reviewId, data),
    onSuccess: (response, variables) => {
      const updatedReview = response.data

      // Update the specific review in all review list queries
      // Use predicate to match all review queries for this product (with any params)
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((review) =>
                review.id === reviewId
                  ? { ...review, ...updatedReview }
                  : review,
              ),
            },
          }
        },
      )

      // Invalidate review summary if rating was changed (to recalculate stats)
      if (variables.rating !== undefined) {
        queryClient.invalidateQueries({
          queryKey: getProductReviewSummaryQueryKey(productId),
        })
      }

      // Invalidate the single review query
      queryClient.invalidateQueries({
        queryKey: getPublicReviewByIdQueryKey(reviewId),
      })

      toast.success('Đánh giá đã được cập nhật!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật đánh giá.')
    },
  })
}

/**
 * Mutation hook to delete a review
 * Uses setQueriesData to remove the review from cache immediately
 */
export const useDeleteReviewMutation = (
  reviewId: string,
  productId: string,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteReviewAPI(reviewId),
    onSuccess: () => {
      // Remove review from all review list queries for this product
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IReviewDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'reviews' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter(
                (review) => review.id !== reviewId,
              ),
              totalCount: Math.max(0, oldData.data.totalCount - 1),
            },
          }
        },
      )

      // Invalidate review summary to recalculate stats
      queryClient.invalidateQueries({
        queryKey: getProductReviewSummaryQueryKey(productId),
      })

      // Invalidate the single review query
      queryClient.invalidateQueries({
        queryKey: getPublicReviewByIdQueryKey(reviewId),
      })

      toast.success('Đánh giá đã được xóa!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể xóa đánh giá.')
    },
  })
}

/**
 * Mutation hook to update a review reply
 * Uses setQueriesData to update the specific reply across all pages in the infinite query cache
 */
export const useUpdateReviewReplyMutation = (
  replyId: string,
  reviewId: string,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IUpdateReviewReplyDataType) =>
      updateReviewReplyAPI(replyId, data),
    onSuccess: (response) => {
      const updatedReply = response.data

      // Update the specific reply across all pages in the infinite query
      queryClient.setQueriesData<{
        pages: IApiPaginationResponseWrapperType<IReviewReplyDataType>[]
        pageParams: unknown[]
      }>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'review-replies' && key[1] === reviewId
          },
        },
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          // Update reply in whichever page it exists
          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((reply) =>
                reply.id === replyId ? { ...reply, ...updatedReply } : reply,
              ),
            },
          }))

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      toast.success('Phản hồi đã được cập nhật!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật phản hồi.')
    },
  })
}

/**
 * Mutation hook to delete a review reply
 * Uses setQueriesData to remove the reply from all pages in the infinite query cache
 */
export const useDeleteReviewReplyMutation = (
  replyId: string,
  reviewId: string,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteReviewReplyAPI(replyId),
    onSuccess: () => {
      // Remove reply from all pages in the infinite query
      queryClient.setQueriesData<{
        pages: IApiPaginationResponseWrapperType<IReviewReplyDataType>[]
        pageParams: unknown[]
      }>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'review-replies' && key[1] === reviewId
          },
        },
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          // Remove reply from whichever page it exists
          const updatedPages = oldData.pages.map((page) => {
            const filteredItems = page.data.items.filter(
              (reply) => reply.id !== replyId,
            )
            const wasDeleted = filteredItems.length < page.data.items.length

            return {
              ...page,
              data: {
                ...page.data,
                items: filteredItems,
                // Only decrease totalCount once (in the page where reply was found)
                totalCount: wasDeleted
                  ? page.data.totalCount - 1
                  : page.data.totalCount,
              },
            }
          })

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      toast.success('Phản hồi đã được xóa!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể xóa phản hồi.')
    },
  })
}
