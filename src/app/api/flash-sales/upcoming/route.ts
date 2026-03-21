import { getUpcomingFlashSalesAPI } from '@/lib/apis/server/admin-flash-sale-apis';
import { proxyRoute } from '@/lib/proxy-route';

// GET /api/flash-sales/upcoming - Get upcoming flash sales (Public)
export const GET = () => {
  return proxyRoute(() => getUpcomingFlashSalesAPI());
};
