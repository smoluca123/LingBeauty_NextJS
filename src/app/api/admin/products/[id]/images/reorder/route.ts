import { reorderProductImagesAPI } from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/products/[id]/images/reorder
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  const body = (await req.json()) as { imageIds: string[] };
  return proxyRoute(() => reorderProductImagesAPI(productId, body.imageIds));
};
