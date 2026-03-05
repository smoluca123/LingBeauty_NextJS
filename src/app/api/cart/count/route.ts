import { getCartCountAPI } from '@/lib/apis/server/cart.apis';
import { proxyRoute } from '@/lib/proxy-route';

/** GET /api/cart/count */
export const GET = () => proxyRoute(() => getCartCountAPI());
