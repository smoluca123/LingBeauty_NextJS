import {
  updateBannerAPI,
  deleteBannerAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/banners/item/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: {
    type?: 'TEXT' | 'IMAGE';
    position?: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
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
  return proxyRoute(() => updateBannerAPI(id, data));
};

// DELETE /api/admin/banners/item/[id]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => deleteBannerAPI(id));
};
