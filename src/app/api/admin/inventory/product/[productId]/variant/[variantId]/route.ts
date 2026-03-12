import { updateVariantInventoryAPI } from '@/lib/apis/server/admin-inventory-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/inventory/product/[productId]/variant/[variantId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ productId: string; variantId: string }> },
) => {
  const { productId, variantId } = await params;
  const body = await req.json();
  return proxyRoute(() => updateVariantInventoryAPI(productId, variantId, body));
};
