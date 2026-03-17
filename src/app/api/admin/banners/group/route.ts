import { createBannerGroupAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/group
export const POST = async (req: Request) => {
  const data: {
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  } = await req.json();
  return proxyRoute(() => createBannerGroupAPI(data));
};
