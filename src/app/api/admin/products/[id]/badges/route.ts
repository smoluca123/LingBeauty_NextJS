import {
  getProductBadgesAPI,
  addProductBadgeAPI,
} from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { ICreateProductBadgePayload } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// GET /api/admin/products/[id]/badges
export const GET = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) =>
  proxyRoute(async () => {
    const { id: productId } = await params;
    return getProductBadgesAPI(productId);
  });

// POST /api/admin/products/[id]/badges
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  const body = (await req.json()) as ICreateProductBadgePayload;
  return proxyRoute(() => addProductBadgeAPI(productId, body));
};
