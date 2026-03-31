import { getPublicBlogTopicsAPI } from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IBlogTopicFilters } from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const params: IBlogTopicFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    search: searchParams.get('search') ?? undefined,
    isActive: searchParams.has('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined,
  }

  return proxyRoute(() => getPublicBlogTopicsAPI(params))
}
