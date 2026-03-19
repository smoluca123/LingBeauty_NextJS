import {
  updateReviewReplyAction,
  deleteReviewReplyAction,
} from '@/lib/apis/server/actions/review.actions';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  replyId: string;
}

/** PATCH /api/review/reply/:replyId — update a review reply */
export const PATCH = (
  req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { replyId } = await params;
    const body = await req.json();
    return updateReviewReplyAction(replyId, body);
  });

/** DELETE /api/review/reply/:replyId — delete a review reply */
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { replyId } = await params;
    return deleteReviewReplyAction(replyId);
  });
