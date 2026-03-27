import { getOrderByIdAPI } from '@/lib/apis/server/order.apis'
import { proxyRoute } from '@/lib/proxy-route'

export const GET = (
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) =>
  proxyRoute(async () => {
    const { orderId } = await params
    return getOrderByIdAPI(orderId)
  })
