import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createReviewAPI,
  markHelpfulAPI,
  unmarkHelpfulAPI,
  createReviewReplyAPI,
} from '@/lib/apis/client/review.apis';
import {
  ICreateReviewDataType,
  ICreateReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces';
import {
  getProductReviewsQueryKey,
  getProductReviewSummaryQueryKey,
  getReviewRepliesQueryKey,
} from '@/hooks/querys/review.query';
import { toast } from 'sonner';

/**
 * Mutation hook to create a new review
 */
export const useCreateReviewMutation = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateReviewDataType) => createReviewAPI(data),
    onSuccess: () => {
      // Invalidate and refetch reviews and summary
      queryClient.invalidateQueries({
        queryKey: getProductReviewsQueryKey(productId),
      });
      queryClient.invalidateQueries({
        queryKey: getProductReviewSummaryQueryKey(productId),
      });
      toast.success('Đánh giá của bạn đã được gửi thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    },
  });
};

/**
 * Mutation hook to mark a review as helpful
 */
export const useMarkHelpfulMutation = (reviewId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markHelpfulAPI(reviewId),
    onSuccess: () => {
      // Invalidate reviews to update helpful count
      queryClient.invalidateQueries({
        queryKey: getProductReviewsQueryKey(productId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể đánh dấu hữu ích.');
    },
  });
};

/**
 * Mutation hook to unmark helpful from a review
 */
export const useUnmarkHelpfulMutation = (
  reviewId: string,
  productId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unmarkHelpfulAPI(reviewId),
    onSuccess: () => {
      // Invalidate reviews to update helpful count
      queryClient.invalidateQueries({
        queryKey: getProductReviewsQueryKey(productId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể bỏ đánh dấu.');
    },
  });
};

/**
 * Mutation hook to create a reply to a review
 */
export const useCreateReviewReplyMutation = (reviewId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateReviewReplyDataType) =>
      createReviewReplyAPI(reviewId, data),
    onSuccess: () => {
      // Invalidate replies to show the new reply
      queryClient.invalidateQueries({
        queryKey: getReviewRepliesQueryKey(reviewId),
      });
      toast.success('Phản hồi của bạn đã được gửi!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể gửi phản hồi. Vui lòng thử lại.');
    },
  });
};
