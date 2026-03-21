import { proxyRoute } from '@/lib/proxy-route';
import {
  getAdminReviewByIdAPI,
  deleteReviewAPI,
} from '@/lib/apis/server/admin-review-apis';

// GET /api/admin/reviews/[reviewId] - Get review by ID
export const GET = (
  _req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) => {
  return proxyRoute(async () => {
    const { reviewId } = await params;
    return getAdminReviewByIdAPI(reviewId);
  });
};

// DELETE /api/admin/reviews/[reviewId] - Delete review
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) => {
  return proxyRoute(async () => {
    const { reviewId } = await params;
    return deleteReviewAPI(reviewId);
  });
};
