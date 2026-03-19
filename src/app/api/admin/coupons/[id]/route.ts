import {
  getCouponByIdAPI,
  updateCouponAPI,
  deleteCouponAPI,
} from '@/lib/apis/server/admin-coupon-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUpdateCouponFormData } from '@/lib/types/interfaces/apis/coupon.interfaces';

interface IRouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/coupons/:id - Get coupon by ID
export const GET = async (req: Request, { params }: IRouteParams) => {
  const { id } = await params;
  return proxyRoute(() => getCouponByIdAPI(id));
};

// PATCH /api/admin/coupons/:id - Update coupon
export const PATCH = async (req: Request, { params }: IRouteParams) => {
  const { id } = await params;
  const data = (await req.json()) as IUpdateCouponFormData;
  return proxyRoute(() => updateCouponAPI(id, data));
};

// DELETE /api/admin/coupons/:id - Delete coupon
export const DELETE = async (req: Request, { params }: IRouteParams) => {
  const { id } = await params;
  return proxyRoute(() => deleteCouponAPI(id));
};
