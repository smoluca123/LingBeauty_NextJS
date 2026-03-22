import {
  createQuestionAPI,
  deleteQuestionAPI,
  updateQuestionAPI,
} from "@/lib/apis/client/product-question.apis";
import {
  ICreateQuestionPayload,
  IProductQuestion,
} from "@/lib/types/interfaces/apis/product-question.interfaces";
import { IApiPaginationResponseWrapperType } from "@/lib/types/interfaces/apis/api.interfaces";
import {
  getProductQuestionsQueryKey,
  getMyQuestionsQueryKey,
} from "@/hooks/querys/product-question.query";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client/query-client";
import { useMutation } from "@tanstack/react-query";

/**
 * Mutation hook to create a new question
 * Uses invalidateQueries to refresh all related question data
 */
export const useCreateQuestionMutation = (productId: string) => {
  return useMutation({
    mutationFn: (data: ICreateQuestionPayload) => createQuestionAPI(data),
    onSuccess: () => {
      // Invalidate and refetch product questions
      queryClient.invalidateQueries({
        queryKey: getProductQuestionsQueryKey(productId),
      });

      // Also invalidate my questions for profile page
      queryClient.invalidateQueries({
        queryKey: getMyQuestionsQueryKey(),
      });

      toast.success("Câu hỏi của bạn đã được gửi thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể gửi câu hỏi. Vui lòng thử lại.");
    },
  });
};

/**
 * Mutation hook to update a question
 * Uses setQueryData to update the question in cache immediately
 */
export const useUpdateQuestionMutation = (
  questionId: string,
  productId: string,
) => {
  return useMutation({
    mutationFn: (data: { question: string }) =>
      updateQuestionAPI(questionId, data),
    onSuccess: (response) => {
      // Update the product questions list
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey;
            return key[0] === "product-questions" && key[1] === productId;
          },
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((q) =>
                q.id === questionId ? response.data : q,
              ),
            },
          };
        },
      );

      // Update my questions list for profile page
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey;
            return key[0] === "my-questions";
          },
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((q) =>
                q.id === questionId ? { ...q, ...response.data } : q,
              ),
            },
          };
        },
      );

      toast.success("Câu hỏi đã được cập nhật!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật câu hỏi.");
    },
  });
};

/**
 * Mutation hook to delete a question
 * Uses setQueryData to remove the question from cache immediately
 */
export const useDeleteQuestionMutation = (
  questionId: string,
  productId: string,
) => {
  return useMutation({
    mutationFn: () => deleteQuestionAPI(questionId),
    onSuccess: () => {
      // Update the product questions list - remove deleted question immediately
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey;
            return key[0] === "product-questions" && key[1] === productId;
          },
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((q) => q.id !== questionId),
              totalCount: oldData.data.totalCount - 1,
            },
          };
        },
      );

      // Update my questions list for profile page
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IProductQuestion> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey;
            return key[0] === "my-questions";
          },
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((q) => q.id !== questionId),
              totalCount: oldData.data.totalCount - 1,
            },
          };
        },
      );

      toast.success("Câu hỏi đã được xóa!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể xóa câu hỏi.");
    },
  });
};
