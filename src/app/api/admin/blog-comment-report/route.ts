import { getAllBlogCommentReportsAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IBlogCommentReportFilters } from '@/lib/types/interfaces/apis/blog-comment.interfaces'
import {
  BlogCommentReportStatus,
  BlogCommentReportReason,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const status = searchParams.get('status')
  const reason = searchParams.get('reason')
  const commentId = searchParams.get('commentId')

  const params: IBlogCommentReportFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    ...(status && { status: status as BlogCommentReportStatus }),
    ...(reason && { reason: reason as BlogCommentReportReason }),
    ...(commentId && { commentId }),
  }
  return proxyRoute(() => getAllBlogCommentReportsAPI(params))
}
