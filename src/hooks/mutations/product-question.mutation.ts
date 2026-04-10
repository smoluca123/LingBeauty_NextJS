import {
  createQuestionAPI,
  deleteQuestionAPI,
  updateQuestionAPI,
} from '@/lib/apis/client/product-question.apis'
import {
  ICreateQuestionPayload,
  IProductQuestion,
} from '@/lib/types/interfaces/apis/product-question.interfaces'
import { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { toast } from 'sonner'
import { queryClient } from '@/lib/query-client/query-client'
import { useMutation } from '@tanstack/react-query'

/**
 * Mutation hook to create a new question
 * Uses setQueryData to add the new question to cache immediately
 */
export const useCreateQuestionMutation = (productId: string) => {
  return useMutation({
    mutationFn: (data: ICreateQuestionPayload) => createQuestionAPI(data),
    onSuccess: (response) => {
      // Update the product questions list - add new question immediately
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'product-questions' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [response.data, ...oldData.data.items],
              totalCount: oldData.data.totalCount + 1,
            },
          }
        },
      )

      // Update my questions list for profile page
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'my-questions'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [response.data, ...oldData.data.items],
              totalCount: oldData.data.totalCount + 1,
            },
          }
        },
      )

      toast.success('Câu hỏi của bạn đã được gửi thành công!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể gửi câu hỏi. Vui lòng thử lại.')
    },
  })
}

/**
 * Mutation hook to update a question
 * Uses optimistic update for instant feedback
 */
export const useUpdateQuestionMutation = (
  questionId: string,
  productId: string,
) => {
  return useMutation({
    mutationFn: (data: { question: string }) =>
      updateQuestionAPI(questionId, data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return (
            (key[0] === 'product-questions' && key[1] === productId) ||
            key[0] === 'my-questions'
          )
        },
      })

      // Snapshot previous values
      const previousProductQuestions = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'product-questions' && key[1] === productId
        },
      })

      const previousMyQuestions = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'my-questions'
        },
      })

      // Optimistically update product questions
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'product-questions' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      question: variables.question,
                      updatedAt: new Date().toISOString(),
                    }
                  : q,
              ),
            },
          }
        },
      )

      // Optimistically update my questions
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'my-questions'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      question: variables.question,
                      updatedAt: new Date().toISOString(),
                    }
                  : q,
              ),
            },
          }
        },
      )

      return { previousProductQuestions, previousMyQuestions }
    },
    onSuccess: (response) => {
      // Update with real data from server
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'product-questions' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((q) =>
                q.id === questionId ? response.data : q,
              ),
            },
          }
        },
      )

      // Update my questions list
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'my-questions'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((q) =>
                q.id === questionId ? { ...q, ...response.data } : q,
              ),
            },
          }
        },
      )

      toast.success('Câu hỏi đã được cập nhật!')
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousProductQuestions) {
        context.previousProductQuestions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousMyQuestions) {
        context.previousMyQuestions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(error.message || 'Không thể cập nhật câu hỏi.')
    },
  })
}

/**
 * Mutation hook to delete a question
 * Uses optimistic update for instant feedback
 */
export const useDeleteQuestionMutation = (
  questionId: string,
  productId: string,
) => {
  return useMutation({
    mutationFn: () => deleteQuestionAPI(questionId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return (
            (key[0] === 'product-questions' && key[1] === productId) ||
            key[0] === 'my-questions'
          )
        },
      })

      // Snapshot previous values
      const previousProductQuestions = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'product-questions' && key[1] === productId
        },
      })

      const previousMyQuestions = queryClient.getQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'my-questions'
        },
      })

      // Optimistically remove from product questions
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'product-questions' && key[1] === productId
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((q) => q.id !== questionId),
              totalCount: Math.max(0, oldData.data.totalCount - 1),
            },
          }
        },
      )

      // Optimistically remove from my questions
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'my-questions'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((q) => q.id !== questionId),
              totalCount: Math.max(0, oldData.data.totalCount - 1),
            },
          }
        },
      )

      return { previousProductQuestions, previousMyQuestions }
    },
    onSuccess: () => {
      toast.success('Câu hỏi đã được xóa!')
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousProductQuestions) {
        context.previousProductQuestions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousMyQuestions) {
        context.previousMyQuestions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(error.message || 'Không thể xóa câu hỏi.')
    },
  })
}
