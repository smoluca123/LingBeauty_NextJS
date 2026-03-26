import { getAllProductsAPI } from '@/lib/apis/server/admin-inventory-apis'
import { proxyRoute } from '@/lib/proxy-route'

// GET /api/admin/inventory/products?page=&limit=&search=&status=
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 20)
  const search = searchParams.get('search') ?? undefined
  const status = searchParams.get('status') ?? undefined
  return proxyRoute(() => getAllProductsAPI({ page, limit, search, status }))
}
