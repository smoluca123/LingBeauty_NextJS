import {
  markHelpfulAction,
  unmarkHelpfulAction,
} from '@/lib/apis/server/actions/review.actions';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  reviewId: string;
}

/** POST /api/review/:reviewId/helpful — mark a review as helpful */
export const POST = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    return markHelpfulAction(reviewId);
  });

/** DELETE /api/review/:reviewId/helpful — unmark helpful from a review */
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { reviewId } = await params;
    return unmarkHelpfulAction(reviewId);
  });
