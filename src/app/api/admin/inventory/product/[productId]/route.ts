import {
  updateProductInventoryAPI,
} from '@/lib/apis/server/admin-inventory-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/inventory/product/[productId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  const { productId } = await params;
  const body = await req.json();
  return proxyRoute(() => updateProductInventoryAPI(productId, body));
};
