import {
  getBlogTopicByIdAPI,
  updateBlogTopicAPI,
  deleteBlogTopicAPI,
} from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUpdateBlogTopicPayload } from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params
    return getBlogTopicByIdAPI(id)
  })
}

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const body = (await req.json()) as IUpdateBlogTopicPayload
  return proxyRoute(() => updateBlogTopicAPI(id, body))
}

export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params
    return deleteBlogTopicAPI(id)
  })
}
