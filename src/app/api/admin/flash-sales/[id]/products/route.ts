import { addProductsToFlashSaleAPI } from '@/lib/apis/server/admin-flash-sale-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IAddFlashSaleProductFormData } from '@/lib/types/interfaces/apis/flash-sale.interfaces';

// POST /api/admin/flash-sales/:id/products - Add products to flash sale
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data = (await req.json()) as IAddFlashSaleProductFormData[];
  return proxyRoute(() => addProductsToFlashSaleAPI(id, data));
};
