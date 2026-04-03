import { createBlogCommentReportAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICreateBlogCommentReportPayload } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateBlogCommentReportPayload
  return proxyRoute(() => createBlogCommentReportAPI(body))
}
