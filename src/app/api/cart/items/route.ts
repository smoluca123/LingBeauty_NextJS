import { addToCartAction } from '@/lib/apis/server/actions/cart.actions';
import { proxyRoute } from '@/lib/proxy-route';
import type { IAddToCartPayload } from '@/lib/types/interfaces/cart.interfaces';

/** POST /api/cart/items */
export const POST = async (request: Request) => {
  const body: IAddToCartPayload = await request.json();
  return proxyRoute(() => addToCartAction(body));
};
