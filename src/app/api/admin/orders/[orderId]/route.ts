import {
  getOrderByIdAdminAPI,
  updateOrderAPI,
} from '@/lib/apis/server/admin-order.apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUpdateOrderPayload } from '@/lib/types/interfaces/apis/admin-order.interfaces'

export const GET = (
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) => {
  return proxyRoute(async () => {
    const { orderId } = await params
    return getOrderByIdAdminAPI(orderId)
  })
}

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) => {
  const { orderId } = await params
  const body = (await req.json()) as IUpdateOrderPayload
  return proxyRoute(() => updateOrderAPI(orderId, body))
}
