import { uploadTopicImageAPI } from '@/lib/apis/server/blog-apis'
import { proxyRoute } from '@/lib/proxy-route'

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const formData = await req.formData()
  return proxyRoute(() => uploadTopicImageAPI(id, formData))
}
