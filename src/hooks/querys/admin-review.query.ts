import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAllAdminReviewsClientAPI,
  getPendingReviewsClientAPI,
  getAdminReviewByIdClientAPI,
  approveReviewClientAPI,
  deleteReviewClientAPI,
  adminReplyToReviewClientAPI,
  getReviewRepliesClientAPI,
  deleteReplyClientAPI,
  getAdminReviewStatsClientAPI,
} from '@/lib/apis/client/admin-review.apis';
import type {
  IAdminReviewFilters,
  ICreateReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminReviewQueryKeys = {
  all: ['admin', 'reviews'] as const,
  list: (params: IAdminReviewFilters) =>
    ['admin', 'reviews', 'list', params] as const,
  pending: (params: Omit<IAdminReviewFilters, 'isApproved'>) =>
    ['admin', 'reviews', 'pending', params] as const,
  detail: (reviewId: string) =>
    ['admin', 'reviews', 'detail', reviewId] as const,
  replies: (reviewId: string) =>
    ['admin', 'reviews', 'replies', reviewId] as const,
  stats: (params?: { startDate?: string; endDate?: string }) =>
    ['admin', 'reviews', 'stats', params] as const,
  infinite: {
    all: ['admin', 'reviews', 'infinite'] as const,
  },
};

// ── Get All Reviews (Admin) ───────────────────────────────────────────────────

export const useAdminReviewsQuery = (params: IAdminReviewFilters = {}) =>
  useQuery({
    queryKey: adminReviewQueryKeys.list(params),
    queryFn: () => getAllAdminReviewsClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev,
  });

// ── Get Pending Reviews (Admin) ───────────────────────────────────────────────

export const usePendingReviewsQuery = (
  params: Omit<IAdminReviewFilters, 'isApproved'> = {},
) =>
  useQuery({
    queryKey: adminReviewQueryKeys.pending(params),
    queryFn: () => getPendingReviewsClientAPI(params),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

// ── Get Review by ID (Admin) ──────────────────────────────────────────────────

export const useAdminReviewByIdQuery = (reviewId: string | null) =>
  useQuery({
    queryKey: adminReviewQueryKeys.detail(reviewId ?? ''),
    queryFn: () => getAdminReviewByIdClientAPI(reviewId!),
    enabled: !!reviewId,
    staleTime: 1000 * 30,
  });

// ── Get Review Replies ────────────────────────────────────────────────────────

export const useReviewRepliesQuery = (reviewId: string | null) =>
  useQuery({
    queryKey: adminReviewQueryKeys.replies(reviewId ?? ''),
    queryFn: () => getReviewRepliesClientAPI(reviewId!),
    enabled: !!reviewId,
    staleTime: 1000 * 30,
  });

// ── Get Review Statistics ─────────────────────────────────────────────────────

export const useAdminReviewStatsQuery = (
  params: { startDate?: string; endDate?: string } = {},
) =>
  useQuery({
    queryKey: adminReviewQueryKeys.stats(params),
    queryFn: () => getAdminReviewStatsClientAPI(params),
    staleTime: 1000 * 60, // 1 phút
  });

// ── Approve Review Mutation ───────────────────────────────────────────────────

export const useApproveReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      isApproved,
    }: {
      reviewId: string;
      isApproved: boolean;
    }) => approveReviewClientAPI(reviewId, isApproved),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminReviewQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminReviewQueryKeys.infinite.all,
      });
      toast.success(
        variables.isApproved ? 'Đã phê duyệt đánh giá' : 'Đã từ chối đánh giá',
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật trạng thái thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Review Mutation ────────────────────────────────────────────────────

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReviewClientAPI(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminReviewQueryKeys.infinite.all,
      });
      toast.success('Đã xóa đánh giá');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa đánh giá thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Admin Reply to Review Mutation ────────────────────────────────────────────

export const useAdminReplyToReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: ICreateReviewReplyDataType;
    }) => adminReplyToReviewClientAPI(reviewId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminReviewQueryKeys.replies(variables.reviewId),
      });
      queryClient.invalidateQueries({ queryKey: adminReviewQueryKeys.all });
      toast.success('Đã gửi phản hồi');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gửi phản hồi thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Reply Mutation ─────────────────────────────────────────────────────

export const useDeleteReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { replyId: string; reviewId: string }) =>
      deleteReplyClientAPI(variables.replyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminReviewQueryKeys.replies(variables.reviewId),
      });
      queryClient.invalidateQueries({ queryKey: adminReviewQueryKeys.all });
      toast.success('Đã xóa phản hồi');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa phản hồi thất bại. Vui lòng thử lại.',
      );
    },
  });
};
