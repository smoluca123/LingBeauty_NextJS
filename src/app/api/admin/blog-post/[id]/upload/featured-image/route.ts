import { proxyRoute } from '@/lib/proxy-route'
import { uploadBlogPostFeaturedImageAPI } from '@/lib/apis/server/blog-apis'

export const POST = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
    })
  }

  return proxyRoute(() => uploadBlogPostFeaturedImageAPI(params.id, file))
}
