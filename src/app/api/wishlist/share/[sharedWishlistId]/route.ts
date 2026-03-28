import { deleteSharedWishlistAPI } from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'

// DELETE /api/wishlist/share/[sharedWishlistId]
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ sharedWishlistId: string }> },
) => {
  const { sharedWishlistId } = await params
  return proxyRoute(() => deleteSharedWishlistAPI(sharedWishlistId))
}
