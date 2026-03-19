import {
  createBannerAPI,
  bulkRemoveBannersFromGroupAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/group/[groupId]/items
// Create a new banner within a specific group
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
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
  } = await req.json();
  // Include groupId in the data body as per new BE API
  return proxyRoute(() => createBannerAPI({ ...data, groupId }));
};

// DELETE /api/admin/banners/group/[groupId]/items
// Bulk remove banners from a group
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
  const { bannerIds }: { bannerIds: string[] } = await req.json();
  return proxyRoute(() => bulkRemoveBannersFromGroupAPI(groupId, bannerIds));
};
