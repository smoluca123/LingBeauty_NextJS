import {
  updateProductBadgeAPI,
  deleteProductBadgeAPI,
} from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUpdateProductBadgePayload } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// PATCH /api/admin/products/[id]/badges/[badgeId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string; badgeId: string }> },
) => {
  const { id: productId, badgeId } = await params;
  const body = (await req.json()) as IUpdateProductBadgePayload;
  return proxyRoute(() => updateProductBadgeAPI(productId, badgeId, body));
};

// DELETE /api/admin/products/[id]/badges/[badgeId]
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ id: string; badgeId: string }> },
) =>
  proxyRoute(async () => {
    const { id: productId, badgeId } = await params;
    return deleteProductBadgeAPI(productId, badgeId);
  });
