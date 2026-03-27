import { cancelOrderAPI } from '@/lib/apis/server/order.apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICancelOrderPayload } from '@/lib/types/interfaces/apis/order.interfaces'

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) => {
  const body = (await req.json()) as ICancelOrderPayload
  return proxyRoute(async () => {
    const { orderId } = await params
    return cancelOrderAPI(orderId, body)
  })
}
