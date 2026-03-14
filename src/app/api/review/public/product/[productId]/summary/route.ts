import { getProductReviewSummaryAPI } from '@/lib/apis/server/review-apis';
import { proxyRoute } from '@/lib/proxy-route';

interface RouteParams {
  productId: string;
}

/** GET /api/review/public/product/:productId/summary — get review summary for a product */
export const GET = (
  _req: Request,
  { params }: { params: Promise<RouteParams> },
) =>
  proxyRoute(async () => {
    const { productId } = await params;
    return getProductReviewSummaryAPI(productId);
  });
