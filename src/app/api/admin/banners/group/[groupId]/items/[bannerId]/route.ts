import {
  addBannerToGroupAPI,
  removeBannerFromGroupAPI,
} from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/group/[groupId]/items/[bannerId]
// Add a banner to a group
export const POST = async (
  _req: Request,
  { params }: { params: Promise<{ groupId: string; bannerId: string }> },
) => {
  const { groupId, bannerId } = await params;
  return proxyRoute(() => addBannerToGroupAPI(groupId, bannerId));
};

// DELETE /api/admin/banners/group/[groupId]/items/[bannerId]
// Remove a banner from a group
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ groupId: string; bannerId: string }> },
) => {
  const { groupId, bannerId } = await params;
  // removeBannerFromGroupAPI expects (groupId, bannerId) - order matches client API
  return proxyRoute(() => removeBannerFromGroupAPI(groupId, bannerId));
};
