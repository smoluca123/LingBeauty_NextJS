import {
  getBannerGroupByIdAPI,
  updateBannerGroupAPI,
  deleteBannerGroupAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/banners/group/[groupId]
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
  return proxyRoute(() => getBannerGroupByIdAPI(groupId));
};

// PATCH /api/admin/banners/group/[groupId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
  const data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  } = await req.json();
  return proxyRoute(() => updateBannerGroupAPI(groupId, data));
};

// DELETE /api/admin/banners/group/[groupId]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
  return proxyRoute(() => deleteBannerGroupAPI(groupId));
};
