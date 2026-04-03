'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from './comment-section'
import type { IBlogPostDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

interface BlogPostContentProps {
  post: IBlogPostDataType
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {post.topic && <Badge variant="secondary">{post.topic.name}</Badge>}
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} lượt xem</span>
            </div>
            {post.author && (
              <div>
                Tác giả:{' '}
                <span className="font-medium">
                  {post.author.fullName || post.author.username}
                </span>
              </div>
            )}
          </div>
        </header>

        {post.featuredImage && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.excerpt && (
          <div className="text-lg text-muted-foreground mb-8 italic border-l-4 border-primary-pink pl-4">
            {post.excerpt}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      <CommentSection postId={post.id} />
    </div>
  )
}
