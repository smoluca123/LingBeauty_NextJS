import { deleteAdminProductAPI } from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';

// DELETE /api/admin/products/[id]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  return proxyRoute(() => deleteAdminProductAPI(productId));
};
