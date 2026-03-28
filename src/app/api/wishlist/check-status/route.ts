import { checkWishlistStatusAPI } from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICheckWishlistStatusDto } from '@/lib/types/interfaces/apis/wishlist.interfaces'

// POST /api/wishlist/check-status
export const POST = async (req: Request) => {
  const body = (await req.json()) as ICheckWishlistStatusDto
  return proxyRoute(() => checkWishlistStatusAPI(body))
}
