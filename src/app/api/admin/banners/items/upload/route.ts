import { createBannerWithUploadAPI } from '@/lib/apis/server/admin-banner-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/banners/items/upload
// Create a new banner with image upload (groupId is passed in the FormData)
export const POST = async (req: Request) => {
  const formData = await req.formData();
  return proxyRoute(() => createBannerWithUploadAPI(formData));
};
