import { updateBannerWithUploadAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/banners/item/[bannerId]/upload
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ bannerId: string }> },
) => {
  const { bannerId } = await params;
  const formData = await req.formData();
  return proxyRoute(() => updateBannerWithUploadAPI(bannerId, formData));
};
