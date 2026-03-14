import { getReviewRepliesAPI } from '@/lib/apis/server/review-apis';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  reviewId: string;
}

/** GET /api/review/:reviewId/replies — get replies for a review */
export const GET = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    return getReviewRepliesAPI(reviewId);
  });
