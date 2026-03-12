import { adjustVariantInventoryAPI } from '@/lib/apis/server/admin-inventory-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/inventory/product/[productId]/variant/[variantId]/adjust
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ productId: string; variantId: string }> },
) => {
  const { productId, variantId } = await params;
  const body = await req.json();
  return proxyRoute(() => adjustVariantInventoryAPI(productId, variantId, body));
};
