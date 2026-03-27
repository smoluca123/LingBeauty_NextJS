import { getAllOrdersAPI } from '@/lib/apis/server/admin-order.apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IAdminOrderFilters } from '@/lib/types/interfaces/apis/admin-order.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const params: IAdminOrderFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    userId: searchParams.get('userId') ?? undefined,
    status:
      (searchParams.get('status') as IAdminOrderFilters['status']) ?? undefined,
    orderNumber: searchParams.get('orderNumber') ?? undefined,
    sortBy:
      (searchParams.get('sortBy') as IAdminOrderFilters['sortBy']) ?? undefined,
    order:
      (searchParams.get('order') as IAdminOrderFilters['order']) ?? undefined,
  }
  return proxyRoute(() => getAllOrdersAPI(params))
}
