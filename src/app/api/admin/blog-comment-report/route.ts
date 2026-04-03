import { getAllBlogCommentReportsAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IBlogCommentReportFilters } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const params: IBlogCommentReportFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    commentId: searchParams.get('commentId') ?? undefined,
    status: searchParams.get('status') as any,
    reason: searchParams.get('reason') as any,
  }
  return proxyRoute(() => getAllBlogCommentReportsAPI(params))
}
