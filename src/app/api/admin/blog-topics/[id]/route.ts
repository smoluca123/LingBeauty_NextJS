import { proxyRoute } from '@/lib/proxy-route'
import {
  getBlogTopicByIdAPI,
  updateBlogTopicAPI,
  deleteBlogTopicAPI,
} from '@/lib/apis/server/blog-apis'

export const GET = (req: Request, { params }: { params: { id: string } }) => {
  return proxyRoute(() => getBlogTopicByIdAPI(params.id))
}

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } },
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

  return proxyRoute(() => updateBlogTopicAPI(params.id, data))
}

export const DELETE = (
  req: Request,
  { params }: { params: { id: string } },
) => {
  return proxyRoute(() => deleteBlogTopicAPI(params.id))
}
