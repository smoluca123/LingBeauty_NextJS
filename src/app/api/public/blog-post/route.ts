import { getPublicBlogPostsAPI } from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IBlogPostFilters } from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const sortByParam = searchParams.get('sortBy')
  const orderParam = searchParams.get('order')

  const params: IBlogPostFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    search: searchParams.get('search') ?? undefined,
    topicId: searchParams.get('topicId') ?? undefined,
    tag: searchParams.get('tag') ?? undefined,
    sortBy:
      sortByParam && sortByParam !== 'null'
        ? (sortByParam as IBlogPostFilters['sortBy'])
        : undefined,
    order:
      orderParam && orderParam !== 'null'
        ? (orderParam as IBlogPostFilters['order'])
        : undefined,
  }

  return proxyRoute(() => getPublicBlogPostsAPI(params))
}
