import {
  getAllAdminCategoriesAPI,
  createCategoryAPI,
} from '@/lib/apis/server/admin-category-brand-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/categories
export const GET = () => proxyRoute(() => getAllAdminCategoriesAPI());

// POST /api/admin/categories
export const POST = async (req: Request) => {
  const formData = await req.formData();
  return proxyRoute(() => createCategoryAPI(formData));
};
