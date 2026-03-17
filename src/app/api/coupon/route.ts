import { getAllCouponsAPI } from '@/lib/apis/server/coupon.apis';
import { proxyRoute } from '@/lib/proxy-route';

/** GET /api/coupon — fetch paginated list of all coupons (admin) */
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);

  const params = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    search: searchParams.get('search') ?? undefined,
  };

  return proxyRoute(() => getAllCouponsAPI(params));
};
