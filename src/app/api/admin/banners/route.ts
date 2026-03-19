import { getAllBannerGroupsAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/banners
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : undefined;
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : undefined;
  const bannerId = searchParams.get('bannerId') || undefined;

  return proxyRoute(() => getAllBannerGroupsAPI({ page, limit, bannerId }));
};
