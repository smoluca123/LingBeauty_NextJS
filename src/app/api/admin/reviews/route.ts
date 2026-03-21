import { type NextRequest } from 'next/server';
import { proxyRoute } from '@/lib/proxy-route';
import { getAllAdminReviewsAPI } from '@/lib/apis/server/admin-review-apis';
import type { IAdminReviewFilters } from '@/lib/types/interfaces/apis/review.interfaces';

// GET /api/admin/reviews - Get all reviews with filters
export const GET = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const params: IAdminReviewFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    productId: searchParams.get('productId') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
    rating: searchParams.has('rating')
      ? Number(searchParams.get('rating'))
      : undefined,
    isApproved: searchParams.has('isApproved')
      ? searchParams.get('isApproved') === 'true'
      : undefined,
    sortBy:
      (searchParams.get('sortBy') as IAdminReviewFilters['sortBy']) ??
      undefined,
    order:
      (searchParams.get('order') as IAdminReviewFilters['order']) ?? undefined,
    search: searchParams.get('search') ?? undefined,
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  };

  return proxyRoute(() => getAllAdminReviewsAPI(params));
};
