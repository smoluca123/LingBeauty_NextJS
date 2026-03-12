import {
  getProductVariantsAPI,
  addProductVariantAPI,
} from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { ICreateProductVariantPayload } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// GET /api/admin/products/[id]/variants
export const GET = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) =>
  proxyRoute(async () => {
    const { id: productId } = await params;
    return getProductVariantsAPI(productId);
  });

// POST /api/admin/products/[id]/variants
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  const body = (await req.json()) as ICreateProductVariantPayload;
  return proxyRoute(() => addProductVariantAPI(productId, body));
};
