import { type NextRequest } from 'next/server';
import { proxyRoute } from '@/lib/proxy-route';
import { getPendingReviewsAPI } from '@/lib/apis/server/admin-review-apis';
import type { IAdminReviewFilters } from '@/lib/types/interfaces/apis/review.interfaces';

// GET /api/admin/reviews/pending - Get pending reviews
export const GET = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const params: Omit<IAdminReviewFilters, 'isApproved'> = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    sortBy:
      (searchParams.get('sortBy') as IAdminReviewFilters['sortBy']) ??
      undefined,
    order:
      (searchParams.get('order') as IAdminReviewFilters['order']) ?? undefined,
  };

  return proxyRoute(() => getPendingReviewsAPI(params));
};
