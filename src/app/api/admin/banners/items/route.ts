import { getAllBannersAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/banners/items
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : undefined;
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : undefined;
  const search = searchParams.get('search') || undefined;
  const groupId = searchParams.get('groupId') || undefined;

  return proxyRoute(() => getAllBannersAPI({ page, limit, search, groupId }));
};
