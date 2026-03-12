import { getProductImagesAPI } from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/admin/products/[id]/images
export const GET = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) =>
  params.then(({ id: productId }) =>
    proxyRoute(() => getProductImagesAPI(productId)),
  );
