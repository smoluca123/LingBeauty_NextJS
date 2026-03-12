import { createSubCategoryAPI } from '@/lib/apis/server/admin-category-brand-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/categories/[id]/sub-category
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const formData = await req.formData();
  return proxyRoute(() => createSubCategoryAPI(id, formData));
};
