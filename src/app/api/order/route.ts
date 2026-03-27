import { createOrderAPI } from '@/lib/apis/server/order.apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICreateOrderPayload } from '@/lib/types/interfaces/apis/order.interfaces'

export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateOrderPayload
  return proxyRoute(() => createOrderAPI(body))
}
