import { moveToCartAPI } from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IMoveToCartDto } from '@/lib/types/interfaces/apis/wishlist.interfaces'

// POST /api/wishlist/move-to-cart
export const POST = async (req: Request) => {
  const body = (await req.json()) as IMoveToCartDto
  return proxyRoute(() => moveToCartAPI(body))
}
