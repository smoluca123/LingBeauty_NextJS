import { getCartAPI } from '@/lib/apis/server/cart.apis';
import { clearCartAction } from '@/lib/apis/server/actions/cart.actions';
import { proxyRoute } from '@/lib/proxy-route';

/** GET /api/cart */
export const GET = () => proxyRoute(() => getCartAPI());

/** DELETE /api/cart */
export const DELETE = () => proxyRoute(() => clearCartAction());
