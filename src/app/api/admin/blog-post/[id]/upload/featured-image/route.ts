import { proxyRoute } from '@/lib/proxy-route'
import { uploadPostFeaturedImageAPI } from '@/lib/apis/server/blog-apis'

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const formData = await req.formData()
  return proxyRoute(() => uploadPostFeaturedImageAPI(id, formData))
}
