import { getOutOfStockVariantsAPI } from '@/lib/apis/server/admin-inventory-apis'
import { proxyRoute } from '@/lib/proxy-route'

// GET /api/admin/inventory/out-of-stock/variants?page=&limit=
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 20)
  return proxyRoute(() => getOutOfStockVariantsAPI(page, limit))
}
