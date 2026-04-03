import { updateBlogCommentReportStatusAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUpdateBlogCommentReportStatusPayload } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const body = (await req.json()) as IUpdateBlogCommentReportStatusPayload
  return proxyRoute(async () => {
    const { id } = await params
    return updateBlogCommentReportStatusAPI(id, body)
  })
}
