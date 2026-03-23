import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAllAdminQuestionsAPI,
  getAdminQuestionByIdAPI,
  answerQuestionAPI,
  updateAnswerAPI,
  deleteAnswerAPI,
  deleteQuestionByAdminAPI,
} from '@/lib/apis/client/admin-product-question.apis';
import type {
  IProductQuestionFilters,
  IAnswerQuestionPayload,
} from '@/lib/types/interfaces/apis/product-question.interfaces';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminQuestionQueryKeys = {
  all: ['admin', 'questions'] as const,
  list: (params: IProductQuestionFilters) =>
    ['admin', 'questions', 'list', params] as const,
  detail: (questionId: string) =>
    ['admin', 'questions', 'detail', questionId] as const,
  infinite: {
    all: ['admin', 'questions', 'infinite'] as const,
  },
};

// ── Get All Questions (Admin) ─────────────────────────────────────────────────

export const useAdminQuestionsQuery = (params: IProductQuestionFilters = {}) =>
  useQuery({
    queryKey: adminQuestionQueryKeys.list(params),
    queryFn: () => getAllAdminQuestionsAPI(params),
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: (prev) => prev,
  });

// ── Get Question by ID (Admin) ────────────────────────────────────────────────

export const useAdminQuestionByIdQuery = (questionId: string | null) =>
  useQuery({
    queryKey: adminQuestionQueryKeys.detail(questionId ?? ''),
    queryFn: () => getAdminQuestionByIdAPI(questionId!),
    enabled: !!questionId,
    staleTime: 1000 * 30,
  });

// ── Infinite Query for Questions ──────────────────────────────────────────────

interface IUseInfiniteAdminQuestionsOptions extends IProductQuestionFilters {
  pageSize?: number;
}

export const useInfiniteAdminQuestions = (
  options: IUseInfiniteAdminQuestionsOptions = {},
) => {
  const { pageSize = 12, ...filters } = options;

  return useInfiniteQuery({
    queryKey: [...adminQuestionQueryKeys.infinite.all, filters],
    queryFn: ({ pageParam = 1 }) =>
      getAllAdminQuestionsAPI({
        ...filters,
        page: pageParam,
        limit: pageSize,
      }),
    getNextPageParam: (lastPage) => {
      const { currentPage, pageSize, totalCount } = lastPage.data;
      const totalPages = Math.ceil(totalCount / pageSize);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 30,
  });
};

// ── Answer Question Mutation ──────────────────────────────────────────────────

export const useAnswerQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: IAnswerQuestionPayload;
    }) => answerQuestionAPI(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionQueryKeys.infinite.all,
      });
      toast.success('Đã trả lời câu hỏi thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Trả lời câu hỏi thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Answer Mutation ────────────────────────────────────────────────────

export const useUpdateAnswerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: IAnswerQuestionPayload;
    }) => updateAnswerAPI(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionQueryKeys.infinite.all,
      });
      toast.success('Đã cập nhật câu trả lời thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật câu trả lời thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Answer Mutation ────────────────────────────────────────────────────

export const useDeleteAnswerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => deleteAnswerAPI(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionQueryKeys.infinite.all,
      });
      toast.success('Đã xóa câu trả lời thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa câu trả lời thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Question Mutation ──────────────────────────────────────────────────

export const useDeleteQuestionByAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => deleteQuestionByAdminAPI(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionQueryKeys.infinite.all,
      });
      toast.success('Đã xóa câu hỏi thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa câu hỏi thất bại. Vui lòng thử lại.',
      );
    },
  });
};
