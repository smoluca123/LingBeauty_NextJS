import {
  getBlogCommentsAPI,
  createBlogCommentAPI,
} from '@/lib/apis/server/blog-comment-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICreateBlogCommentPayload } from '@/lib/types/interfaces/apis/blog-comment.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const params = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    postId: searchParams.get('postId') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
    parentId: searchParams.get('parentId') ?? undefined,
  }

  return proxyRoute(() => getBlogCommentsAPI(params))
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateBlogCommentPayload
  return proxyRoute(() => createBlogCommentAPI(body))
}
