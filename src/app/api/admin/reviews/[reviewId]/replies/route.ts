import { proxyRoute } from '@/lib/proxy-route';
import { getReviewRepliesAPI } from '@/lib/apis/server/admin-review-apis';

// GET /api/admin/reviews/[reviewId]/replies - Get review replies
export const GET = (
  _req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) => {
  return proxyRoute(async () => {
    const { reviewId } = await params;
    return getReviewRepliesAPI(reviewId);
  });
};
