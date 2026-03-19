import {
  deleteAdminProductAPI,
  updateAdminProductAPI,
} from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/products/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  const data = await req.json();
  return proxyRoute(() => updateAdminProductAPI(productId, data));
};

// DELETE /api/admin/products/[id]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  return proxyRoute(() => deleteAdminProductAPI(productId));
};
