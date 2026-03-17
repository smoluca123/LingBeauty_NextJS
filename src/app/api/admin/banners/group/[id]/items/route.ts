import { createBannerAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/group/[id]/items
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
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
  return proxyRoute(() => createBannerAPI(id, data));
};
