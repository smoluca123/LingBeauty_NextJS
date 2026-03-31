import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicBlogPostBySlugAPI } from '@/lib/apis/server/blog-apis'
import { BlogPostContent } from './components/blog-post-content'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getPublicBlogPostBySlugAPI(slug)
    const post = response.data

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    }
  } catch {
    return {
      title: 'Bài viết không tồn tại',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  try {
    const response = await getPublicBlogPostBySlugAPI(slug)
    return <BlogPostContent post={response.data} />
  } catch {
    notFound()
  }
}
