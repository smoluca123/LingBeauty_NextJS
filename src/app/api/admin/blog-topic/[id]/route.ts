import { proxyRoute } from '@/lib/proxy-route'
import {
  getBlogTopicByIdAPI,
  updateBlogTopicAPI,
  deleteBlogTopicAPI,
} from '@/lib/apis/server/blog-apis'

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  return proxyRoute(() => getBlogTopicByIdAPI(id))
}

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const body = await req.json()

  const { id } = await params
  return proxyRoute(() => updateBlogTopicAPI(id, body))
}

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  return proxyRoute(() => deleteBlogTopicAPI(id))
}
