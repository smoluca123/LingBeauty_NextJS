import {
  createBannerAPI,
  getAllBannersAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/banners/items
// Get all banners with pagination, search, and groupId filter
export const GET = async (req: Request) => {
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

// POST /api/admin/banners/items
// Create a new banner (groupId is passed in the body)
export const POST = async (req: Request) => {
  const data: {
    type: 'TEXT' | 'IMAGE';
    position: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
    badge?: string;
    title?: string;
    description?: string;
    highlight?: string;
    ctaText?: string;
    ctaLink?: string;
    subLabel?: string;
    gradientFrom?: string;
    gradientTo?: string;
    sortOrder?: number;
    isActive?: boolean;
    groupId?: string;
  } = await req.json();
  return proxyRoute(() => createBannerAPI(data));
};
