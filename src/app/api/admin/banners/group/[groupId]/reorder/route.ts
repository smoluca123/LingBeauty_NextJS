import { reorderBannersInGroupAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/banners/group/[groupId]/reorder
// Reorder banners within a group
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
  const {
    orderData,
  }: { orderData: Array<{ bannerId: string; sortOrder: number }> } =
    await req.json();
  return proxyRoute(() => reorderBannersInGroupAPI(groupId, orderData));
};
