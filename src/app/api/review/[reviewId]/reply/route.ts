import { createReviewReplyAction } from '@/lib/apis/server/actions/review.actions';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  reviewId: string;
}

/** POST /api/review/:reviewId/reply — create a reply to a review */
export const POST = (
  req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    const body = await req.json();
    return createReviewReplyAction(reviewId, body);
  });
