import { addToWishlistAPI } from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IAddToWishlistDto } from '@/lib/types/interfaces/apis/wishlist.interfaces'

// POST /api/wishlist/items
export const POST = async (req: Request) => {
  const body = (await req.json()) as IAddToWishlistDto
  return proxyRoute(() => addToWishlistAPI(body))
}
