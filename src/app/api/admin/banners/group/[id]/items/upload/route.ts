import { createBannerWithUploadAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/group/[id]/items/upload
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const formData = await req.formData();
  return proxyRoute(() => createBannerWithUploadAPI(id, formData));
};
