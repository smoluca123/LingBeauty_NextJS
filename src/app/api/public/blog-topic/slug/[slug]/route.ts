import { getPublicBlogTopicBySlugAPI } from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'

export const GET = (
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  return proxyRoute(async () => {
    const { slug } = await params
    return getPublicBlogTopicBySlugAPI(slug)
  })
}
