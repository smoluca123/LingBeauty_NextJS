import { proxyRoute } from '@/lib/proxy-route'
import {
  getBlogTopicByIdAPI,
  updateBlogTopicAPI,
  deleteBlogTopicAPI,
} from '@/lib/apis/server/blog-apis'

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  return proxyRoute(() => getBlogTopicByIdAPI(id))
}

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const formData = await req.formData()

  const data = {
    name: formData.get('name') as string | undefined,
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

  const { id } = await params
  return proxyRoute(() => updateBlogTopicAPI(id, data))
}

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  return proxyRoute(() => deleteBlogTopicAPI(id))
}
