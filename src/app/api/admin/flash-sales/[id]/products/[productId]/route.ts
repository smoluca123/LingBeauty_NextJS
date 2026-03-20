import {
  updateFlashSaleProductAPI,
  removeProductFromFlashSaleAPI,
} from '@/lib/apis/server/admin-flash-sale-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUpdateFlashSaleProductFormData } from '@/lib/types/interfaces/apis/flash-sale.interfaces';

// PUT /api/admin/flash-sales/:id/products/:productId
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string; productId: string }> },
) => {
  const { id, productId } = await params;
  const { searchParams } = new URL(req.url);
  const variantId = searchParams.get('variantId') || undefined;
  const data = (await req.json()) as IUpdateFlashSaleProductFormData;

  return proxyRoute(() =>
    updateFlashSaleProductAPI(id, productId, data, variantId),
  );
};

// DELETE /api/admin/flash-sales/:id/products/:productId
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string; productId: string }> },
) => {
  const { id, productId } = await params;
  const { searchParams } = new URL(req.url);
  const variantId = searchParams.get('variantId') || undefined;

  return proxyRoute(() =>
    removeProductFromFlashSaleAPI(id, productId, variantId),
  );
};
