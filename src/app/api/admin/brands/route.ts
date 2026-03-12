import {
  getAllAdminBrandsAPI,
  createBrandAPI,
} from '@/lib/apis/server/admin-category-brand-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/brands
export const GET = () => proxyRoute(() => getAllAdminBrandsAPI());

// POST /api/admin/brands
export const POST = async (req: Request) => {
  const formData = await req.formData();
  return proxyRoute(() => createBrandAPI(formData));
};
