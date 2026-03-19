import {
  updateReviewAction,
  deleteReviewAction,
} from '@/lib/apis/server/actions/review.actions';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  reviewId: string;
}

/** PATCH /api/review/:reviewId — update a review */
export const PATCH = (
  req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    const body = await req.json();
    return updateReviewAction(reviewId, body);
  });

/** DELETE /api/review/:reviewId — delete a review */
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    return deleteReviewAction(reviewId);
  });
