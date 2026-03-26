import { getInventoryOverviewAPI } from '@/lib/apis/server/admin-inventory-apis'
import { proxyRoute } from '@/lib/proxy-route'

// GET /api/admin/inventory/overview
export const GET = () => proxyRoute(() => getInventoryOverviewAPI())
