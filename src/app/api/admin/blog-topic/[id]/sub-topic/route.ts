import { proxyRoute } from '@/lib/proxy-route'
import { createSubTopicAPI } from '@/lib/apis/server/blog-apis'
import type { ICreateBlogTopicPayload } from '@/lib/types/interfaces/apis/blog.interfaces'

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const body = (await req.json()) as ICreateBlogTopicPayload
  const { id } = await params
  return proxyRoute(() => createSubTopicAPI(id, body))
}
