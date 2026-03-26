import {
  removeCartItemAction,
  updateCartItemAction,
} from '@/lib/apis/server/actions/cart.actions'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUpdateCartItemPayload } from '@/lib/types/interfaces/cart.interfaces'

/** PATCH /api/cart/items/:itemId */
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) => {
  const { itemId } = await params
  const body: IUpdateCartItemPayload = await request.json()
  return proxyRoute(() => updateCartItemAction(itemId, body))
}

/** DELETE /api/cart/items/:itemId */
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) => {
  const { itemId } = await params
  return proxyRoute(() => removeCartItemAction(itemId))
}
