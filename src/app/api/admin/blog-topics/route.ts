import { proxyRoute } from '@/lib/proxy-route'
import {
  getAllBlogTopicsAPI,
  createBlogTopicAPI,
} from '@/lib/apis/server/blog-apis'
import type { IBlogTopicFilters } from '@/lib/types/interfaces/apis/blog.interfaces'

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
  const formData = await req.formData()

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string | undefined,
    parentId: formData.get('parentId') as string | undefined,
    sortOrder: formData.has('sortOrder')
      ? Number(formData.get('sortOrder'))
      : undefined,
    isActive: formData.has('isActive')
      ? formData.get('isActive') === 'true'
      : undefined,
    image: formData.get('image') as File | undefined,
  }

  return proxyRoute(() => createBlogTopicAPI(data))
}
