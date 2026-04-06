import { getBlogCommentReportByIdAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'

export const GET = (
  _req: Request,
  context: { params: Promise<{ id: string }> },
) =>
  proxyRoute(async () => {
    const { id } = await context.params
    return getBlogCommentReportByIdAPI(id)
  })
