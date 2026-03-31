import { proxyRoute } from '@/lib/proxy-route'
import {
  getAllBlogTopicsAPI,
  createBlogTopicAPI,
} from '@/lib/apis/server/blog-apis'
import type {
  IBlogTopicFilters,
  ICreateBlogTopicPayload,
} from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const filters: IBlogTopicFilters = {
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

  return proxyRoute(() => getAllBlogTopicsAPI(filters))
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateBlogTopicPayload
  return proxyRoute(() => createBlogTopicAPI(body))
}
