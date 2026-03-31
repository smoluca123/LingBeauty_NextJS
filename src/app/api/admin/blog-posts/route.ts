import { proxyRoute } from '@/lib/proxy-route'
import {
  getAllBlogPostsAPI,
  createBlogPostAPI,
} from '@/lib/apis/server/blog-apis'
import type { IBlogPostFilters } from '@/lib/types/interfaces/apis/blog.interfaces'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

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
    status: searchParams.get('status') as BlogPostStatus | undefined,
    tag: searchParams.get('tag') ?? undefined,
    sortBy: searchParams.get('sortBy') as
      | 'createdAt'
      | 'updatedAt'
      | 'title'
      | 'viewCount'
      | undefined,
    order: searchParams.get('order') as 'asc' | 'desc' | undefined,
  }

  return proxyRoute(() => getAllBlogPostsAPI(filters))
}

export const POST = async (req: Request) => {
  const body = await req.json()
  return proxyRoute(() => createBlogPostAPI(body))
}
