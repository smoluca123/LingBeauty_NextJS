import { BlogContent } from './components/blog-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý Blog | Admin',
  description: 'Quản lý bài viết và chủ đề blog',
}

export default function BlogPage() {
  return <BlogContent />
}
