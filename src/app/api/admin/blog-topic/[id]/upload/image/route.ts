import { proxyRoute } from '@/lib/proxy-route'
import { uploadBlogTopicImageAPI } from '@/lib/apis/server/blog-apis'

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const { id } = await params

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
    })
  }

  return proxyRoute(() => uploadBlogTopicImageAPI(id, file))
}
