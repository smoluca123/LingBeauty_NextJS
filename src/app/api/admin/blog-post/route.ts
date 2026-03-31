import {
  getAllBlogPostsAPI,
  createBlogPostAPI,
} from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type {
  IBlogPostFilters,
  ICreateBlogPostPayload,
  BlogPostStatus,
} from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const statusParam = searchParams.get('status')
  const sortByParam = searchParams.get('sortBy')
  const orderParam = searchParams.get('order')

  const filters: IBlogPostFilters = {
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
      statusParam && statusParam !== 'null'
        ? (statusParam as BlogPostStatus)
        : undefined,
    tag: searchParams.get('tag') ?? undefined,
    sortBy:
      sortByParam && sortByParam !== 'null'
        ? (sortByParam as 'createdAt' | 'updatedAt' | 'title' | 'viewCount')
        : undefined,
    order:
      orderParam && orderParam !== 'null'
        ? (orderParam as 'asc' | 'desc')
        : undefined,
  }

  return proxyRoute(() => getAllBlogPostsAPI(filters))
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateBlogPostPayload
  return proxyRoute(() => createBlogPostAPI(body))
}
