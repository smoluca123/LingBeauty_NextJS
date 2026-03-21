import { type NextRequest } from 'next/server';
import { proxyRoute } from '@/lib/proxy-route';
import { approveReviewAPI } from '@/lib/apis/server/admin-review-apis';

// PATCH /api/admin/reviews/[reviewId]/approve - Approve or reject review
export const PATCH = (
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) => {
  return proxyRoute(async () => {
    const { reviewId } = await params;
    const { searchParams } = new URL(req.url);
    const isApproved = searchParams.get('isApproved') === 'true';
    return approveReviewAPI(reviewId, isApproved);
  });
};
