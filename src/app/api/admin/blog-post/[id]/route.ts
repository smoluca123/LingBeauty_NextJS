import { proxyRoute } from '@/lib/proxy-route'
import {
  getBlogPostByIdAPI,
  updateBlogPostAPI,
  deleteBlogPostAPI,
} from '@/lib/apis/server/blog-apis'

export const GET = (_req: Request, { params }: { params: { id: string } }) => {
  return proxyRoute(() => getBlogPostByIdAPI(params.id))
}

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const body = await req.json()
  return proxyRoute(() => updateBlogPostAPI(params.id, body))
}

export const DELETE = (
  _req: Request,
  { params }: { params: { id: string } },
) => {
  return proxyRoute(() => deleteBlogPostAPI(params.id))
}
