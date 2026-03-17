import { updateBannerWithUploadAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/banners/item/[id]/upload
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const formData = await req.formData();
  return proxyRoute(() => updateBannerWithUploadAPI(id, formData));
};
