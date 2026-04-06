import { getAllAdminBlogCommentsAPI } from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IBlogCommentFilters } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const params: IBlogCommentFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    postId: searchParams.get('postId') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
  }
  return proxyRoute(() => getAllAdminBlogCommentsAPI(params))
}
