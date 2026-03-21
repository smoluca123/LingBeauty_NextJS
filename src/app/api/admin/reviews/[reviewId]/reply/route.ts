import { proxyRoute } from '@/lib/proxy-route';
import { adminReplyToReviewAPI } from '@/lib/apis/server/admin-review-apis';
import type { ICreateReviewReplyDataType } from '@/lib/types/interfaces/apis/review.interfaces';

// POST /api/admin/reviews/[reviewId]/reply - Admin reply to review
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) => {
  return proxyRoute(async () => {
    const { reviewId } = await params;
    const body = (await req.json()) as ICreateReviewReplyDataType;
    return adminReplyToReviewAPI(reviewId, body);
  });
};
