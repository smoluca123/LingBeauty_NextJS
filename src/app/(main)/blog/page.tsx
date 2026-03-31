import { Metadata } from 'next'
import { BlogListingContent } from './components/blog-listing-content'

export const metadata: Metadata = {
  title: 'Blog | Beauty Store',
  description:
    'Khám phá các bài viết về làm đẹp, chăm sóc da và xu hướng làm đẹp mới nhất',
}

export default function BlogPage() {
  return <BlogListingContent />
}
