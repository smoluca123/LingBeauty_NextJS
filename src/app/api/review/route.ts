import { createReviewAction } from '@/lib/apis/server/actions/review.actions'
import { proxyRoute } from '@/lib/proxy-route'

/** POST /api/review — create a new review */
export const POST = (req: Request) =>
  proxyRoute(async () => {
    const body = await req.json()
    return createReviewAction(body)
  })
