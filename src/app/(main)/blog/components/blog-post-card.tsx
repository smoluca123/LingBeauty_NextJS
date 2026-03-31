import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye } from 'lucide-react'
import type { IBlogPostDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface BlogPostCardProps {
  post: IBlogPostDataType
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  // Calculate read time based on content length (rough estimate: 200 words per minute)
  const wordCount = post.content?.split(/\s+/).length || 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <Link href={`/blog/${post.slug}`} className="h-full block">
      <article className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {/* Badge */}
          {post.topic && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-primary-pink shadow-md backdrop-blur-sm">
              {post.topic.name}
            </div>
          )}

          {post.featuredImage ? (
            <Image
              src={post.featuredImage.url}
              alt={post.title}
              fill
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-pink/10 to-primary-pink/5">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground min-h-14">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground flex-1 min-h-16">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground h-fit">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime} phút đọc
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.viewCount} lượt xem
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
