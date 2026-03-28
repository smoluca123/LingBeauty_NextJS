import { getSharedWishlistAPI } from '@/lib/apis/server/wishlist-apis'
import { proxyRoute } from '@/lib/proxy-route'

// GET /api/wishlist/shared/[shareToken] (public access)
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ shareToken: string }> },
) => {
  const { shareToken } = await params
  return proxyRoute(() => getSharedWishlistAPI(shareToken))
}
