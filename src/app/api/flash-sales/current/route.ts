import { getCurrentFlashSaleAPI } from '@/lib/apis/server/admin-flash-sale-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/flash-sales/current - Get current active flash sale (Public)
export const GET = () => {
  return proxyRoute(() => getCurrentFlashSaleAPI());
};
