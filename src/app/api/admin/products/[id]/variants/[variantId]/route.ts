import {
  updateProductVariantAPI,
  deleteProductVariantAPI,
} from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUpdateProductVariantPayload } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// PATCH /api/admin/products/[id]/variants/[variantId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> },
) => {
  const { id: productId, variantId } = await params;
  const body = (await req.json()) as IUpdateProductVariantPayload;
  return proxyRoute(() => updateProductVariantAPI(productId, variantId, body));
};

// DELETE /api/admin/products/[id]/variants/[variantId]
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> },
) =>
  proxyRoute(async () => {
    const { id: productId, variantId } = await params;
    return deleteProductVariantAPI(productId, variantId);
  });
