import {
  updateBrandAPI,
  deleteBrandAPI,
} from '@/lib/apis/server/admin-category-brand-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/brands/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const formData = await req.formData();
  return proxyRoute(() => updateBrandAPI(id, formData));
};

// DELETE /api/admin/brands/[id]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => deleteBrandAPI(id));
};
