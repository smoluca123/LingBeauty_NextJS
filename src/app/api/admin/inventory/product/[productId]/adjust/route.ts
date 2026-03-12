import { adjustProductInventoryAPI } from '@/lib/apis/server/admin-inventory-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/inventory/product/[productId]/adjust
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  const { productId } = await params;
  const body = await req.json();
  return proxyRoute(() => adjustProductInventoryAPI(productId, body));
};
