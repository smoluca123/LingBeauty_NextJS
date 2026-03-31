import {
  getAllBlogPostsAPI,
  createBlogPostAPI,
} from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type {
  IBlogPostFilters,
  ICreateBlogPostPayload,
} from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const params: IBlogPostFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    search: searchParams.get('search') ?? undefined,
    topicId: searchParams.get('topicId') ?? undefined,
    authorId: searchParams.get('authorId') ?? undefined,
    status:
      (searchParams.get('status') as IBlogPostFilters['status']) ?? undefined,
    tag: searchParams.get('tag') ?? undefined,
    sortBy:
      (searchParams.get('sortBy') as IBlogPostFilters['sortBy']) ?? undefined,
    order:
      (searchParams.get('order') as IBlogPostFilters['order']) ?? undefined,
  }

  return proxyRoute(() => getAllBlogPostsAPI(params))
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateBlogPostPayload
  return proxyRoute(() => createBlogPostAPI(body))
}
