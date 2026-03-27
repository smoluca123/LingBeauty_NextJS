import { getMyOrdersAPI } from '@/lib/apis/server/order.apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IGetMyOrdersParams } from '@/lib/types/interfaces/apis/order.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const params: IGetMyOrdersParams = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    status:
      (searchParams.get('status') as IGetMyOrdersParams['status']) ?? undefined,
  }
  return proxyRoute(() => getMyOrdersAPI(params))
}
