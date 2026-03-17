import { removeBannerFromGroupAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// DELETE /api/admin/banners/item/[id]/groups/[groupId] - Remove banner from a group
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) => {
  const { id, groupId } = await params;
  return proxyRoute(() => removeBannerFromGroupAPI(id, groupId));
};
