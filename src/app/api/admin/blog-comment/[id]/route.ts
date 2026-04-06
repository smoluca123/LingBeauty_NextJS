import {
  updateAdminBlogCommentAPI,
  adminDeleteBlogCommentAPI,
} from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'

export const PATCH = (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await context.params
    const body = await req.json()
    return updateAdminBlogCommentAPI(id, body)
  })
}

export const DELETE = (
  _req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await context.params
    return adminDeleteBlogCommentAPI(id)
  })
}
