import {
  getBannerGroupByIdAPI,
  updateBannerGroupAPI,
  deleteBannerGroupAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/banners/group/[id]
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => getBannerGroupByIdAPI(id));
};

// PATCH /api/admin/banners/group/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  } = await req.json();
  return proxyRoute(() => updateBannerGroupAPI(id, data));
};

// DELETE /api/admin/banners/group/[id]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => deleteBannerGroupAPI(id));
};
