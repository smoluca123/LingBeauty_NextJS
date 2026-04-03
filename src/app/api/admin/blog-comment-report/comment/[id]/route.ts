import { adminDeleteBlogCommentAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'

export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params
    return adminDeleteBlogCommentAPI(id)
  })
}
