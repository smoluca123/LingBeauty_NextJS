import { proxyRoute } from '@/lib/proxy-route'
import { createSubTopicAPI } from '@/lib/apis/server/blog-apis'

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const body = await req.json()
  const { id } = await params
  return proxyRoute(() => createSubTopicAPI(id, body))
}
