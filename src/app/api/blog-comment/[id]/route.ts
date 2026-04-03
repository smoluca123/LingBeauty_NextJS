import {
  getBlogCommentByIdAPI,
  updateBlogCommentAPI,
  deleteBlogCommentAPI,
} from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUpdateBlogCommentPayload } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const GET = (
  _req: Request,
  context: { params: Promise<{ id: string }> },
) =>
  proxyRoute(async () => {
    const { id } = await context.params
    return getBlogCommentByIdAPI(id)
  })

export const PATCH = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params
  const body = (await req.json()) as IUpdateBlogCommentPayload
  return proxyRoute(() => updateBlogCommentAPI(id, body))
}

export const DELETE = (
  _req: Request,
  context: { params: Promise<{ id: string }> },
) =>
  proxyRoute(async () => {
    const { id } = await context.params
    return deleteBlogCommentAPI(id)
  })
