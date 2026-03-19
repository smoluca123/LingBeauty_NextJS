import { createBannerWithUploadAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/group/[groupId]/items/upload
// Note: groupId is now included in the FormData as 'groupId' field
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) => {
  const { groupId } = await params;
  const formData = await req.formData();
  // Add groupId to FormData for the BE API
  formData.append('groupId', groupId);
  return proxyRoute(() => createBannerWithUploadAPI(formData));
};
