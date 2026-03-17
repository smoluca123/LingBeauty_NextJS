import { applyCouponAction } from '@/lib/apis/server/actions/coupon.actions';
import { proxyRoute } from '@/lib/proxy-route';
import type { IApplyCouponPayload } from '@/lib/types/interfaces/coupon.interfaces';

/** POST /api/coupon/apply — validate and calculate discount for a coupon code */
export const POST = async (req: Request) => {
  const body: IApplyCouponPayload = await req.json();
  return proxyRoute(() => applyCouponAction(body));
};
