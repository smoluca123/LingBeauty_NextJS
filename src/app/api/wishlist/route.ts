import {
  getWishlistAPI,
  clearWishlistAPI,
} from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'

// GET /api/wishlist
export const GET = () => {
  return proxyRoute(() => getWishlistAPI())
}

// DELETE /api/wishlist
export const DELETE = () => {
  return proxyRoute(() => clearWishlistAPI())
}
