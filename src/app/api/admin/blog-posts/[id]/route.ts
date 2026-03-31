import { proxyRoute } from '@/lib/proxy-route'
import {
  getBlogPostByIdAPI,
  updateBlogPostAPI,
  deleteBlogPostAPI,
} from '@/lib/apis/server/blog-apis'

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  return proxyRoute(() => getBlogPostByIdAPI(id))
}

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  const body = await req.json()
  return proxyRoute(() => updateBlogPostAPI(id, body))
}

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  return proxyRoute(() => deleteBlogPostAPI(id))
}
