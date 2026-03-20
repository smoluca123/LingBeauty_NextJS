import {
  getFlashSaleByIdAPI,
  updateFlashSaleAPI,
  deleteFlashSaleAPI,
} from '@/lib/apis/server/admin-flash-sale-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUpdateFlashSaleFormData } from '@/lib/types/interfaces/apis/flash-sale.interfaces';

// GET /api/admin/flash-sales/:id
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => getFlashSaleByIdAPI(id));
};

// PUT /api/admin/flash-sales/:id
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const data = (await req.json()) as IUpdateFlashSaleFormData;
  return proxyRoute(() => updateFlashSaleAPI(id, data));
};

// DELETE /api/admin/flash-sales/:id
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => deleteFlashSaleAPI(id));
};
