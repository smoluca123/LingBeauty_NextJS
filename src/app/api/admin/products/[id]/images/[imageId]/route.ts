import {
  updateProductImageAPI,
  deleteProductImageAPI,
} from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUpdateProductImagePayload } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// PATCH /api/admin/products/[id]/images/[imageId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) => {
  const { id: productId, imageId } = await params;
  const body = (await req.json()) as IUpdateProductImagePayload;
  return proxyRoute(() => updateProductImageAPI(productId, imageId, body));
};

// DELETE /api/admin/products/[id]/images/[imageId]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) => {
  const { id: productId, imageId } = await params;
  return proxyRoute(() => deleteProductImageAPI(productId, imageId));
};
