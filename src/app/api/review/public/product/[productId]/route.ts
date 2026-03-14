import { getPublicProductReviewsAPI } from '@/lib/apis/server/review-apis';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  productId: string;
}

/** GET /api/review/public/product/:productId — get public reviews for a product */
export const GET = (
  req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { productId } = await params;
    const { searchParams } = new URL(req.url);

    const sortByValue = searchParams.get('sortBy');
    const validSortBy = ['rating', 'helpfulCount', 'createdAt'];

    const options = {
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!, 10)
        : 1,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!, 10)
        : 10,
      rating: searchParams.get('rating')
        ? parseInt(searchParams.get('rating')!, 10)
        : undefined,
      sortBy: validSortBy.includes(sortByValue || '')
        ? (sortByValue as 'rating' | 'helpfulCount' | 'createdAt')
        : undefined,
      order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
    };

    return getPublicProductReviewsAPI(productId, options);
  });
