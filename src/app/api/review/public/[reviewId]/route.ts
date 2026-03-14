import { getPublicReviewByIdAPI } from '@/lib/apis/server/review-apis';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  reviewId: string;
}

/** GET /api/review/public/:reviewId — get a single public review by ID */
export const GET = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    return getPublicReviewByIdAPI(reviewId);
  });
