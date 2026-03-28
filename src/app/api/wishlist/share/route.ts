import {
  getMySharedWishlistsAPI,
  createSharedWishlistAPI,
} from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICreateSharedWishlistDto } from '@/lib/types/interfaces/apis/wishlist.interfaces'

// GET /api/wishlist/share
export const GET = () => {
  return proxyRoute(() => getMySharedWishlistsAPI())
}

// POST /api/wishlist/share
export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateSharedWishlistDto
  return proxyRoute(() => createSharedWishlistAPI(body))
}
