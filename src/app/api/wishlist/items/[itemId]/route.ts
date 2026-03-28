import {
  updateWishlistItemAPI,
  removeFromWishlistAPI,
} from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUpdateWishlistItemDto } from '@/lib/types/interfaces/apis/wishlist.interfaces'

// PATCH /api/wishlist/items/[itemId]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) => {
  const { itemId } = await params
  const body = (await req.json()) as IUpdateWishlistItemDto
  return proxyRoute(() => updateWishlistItemAPI(itemId, body))
}

// DELETE /api/wishlist/items/[itemId]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) => {
  const { itemId } = await params
  return proxyRoute(() => removeFromWishlistAPI(itemId))
}
