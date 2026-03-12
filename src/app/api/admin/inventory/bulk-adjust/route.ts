import { bulkAdjustInventoryAPI } from '@/lib/apis/server/admin-inventory-apis';
import { proxyRoute } from '@/lib/proxy-route';

// POST /api/admin/inventory/bulk-adjust
export const POST = async (req: Request) => {
  const body = await req.json();
  return proxyRoute(() => bulkAdjustInventoryAPI(body));
};
