import { adminDeleteBlogCommentAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'

export const DELETE = (
  _req: Request,
  context: { params: Promise<{ id: string }> },
) =>
  proxyRoute(async () => {
    const { id } = await context.params
    return adminDeleteBlogCommentAPI(id)
  })
