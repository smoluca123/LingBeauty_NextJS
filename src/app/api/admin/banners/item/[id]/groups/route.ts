import {
  getBannerGroupsAPI,
  addBannerToGroupAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/banners/item/[id]/groups - Get all groups of a banner
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => getBannerGroupsAPI(id));
};

// POST /api/admin/banners/item/[id]/groups - Add banner to a group
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data: { groupId: string; sortOrder?: number } = await req.json();
  return proxyRoute(() => addBannerToGroupAPI(id, data));
};
