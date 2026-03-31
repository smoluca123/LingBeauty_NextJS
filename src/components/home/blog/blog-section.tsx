'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'
import { Button } from '@/components/ui/button'
import { SectionHeadingCenter } from '@/components/home/section-heading'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'

interface BlogSectionProps {
  posts: IBlogPostDataType[]
  topics: IBlogTopicDataType[]
}

export default function BlogSection({ posts, topics }: BlogSectionProps) {
  const [activeTab, setActiveTab] = useState('all')

  // Filter posts by selected topic
  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') {
      return posts.slice(0, 6) // Show max 6 posts
    }
    return posts.filter((post) => post.topic?.id === activeTab).slice(0, 6)
  }, [activeTab, posts])

  // Prepare categories with "all" option
  const categories = useMemo(() => {
    const allCategory = { id: 'all', name: 'Tất cả' }
    return [allCategory, ...topics.slice(0, 5)] // Show max 6 categories including "all"
  }, [topics])

  // Calculate read time
  const getReadTime = (content: string) => {
    const wordCount = content?.split(/\s+/).length || 0
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <SectionHeadingCenter
            title="GÓC ĐẸP BEAUTY BOX"
            subtitle="Khám phá những bài viết hay về làm đẹp"
            eyebrow="BEAUTY"
            className="w-full"
          />

          {/* Tabs */}
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide">
            <div className="flex min-w-max justify-center gap-6 px-4 md:gap-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  variant="ghost"
                  className={cn(
                    'relative pb-3 text-sm font-medium transition-colors duration-300 md:text-base',
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
                    'after:bg-primary-pink after:transition-transform after:duration-300',
                    activeTab === category.id
                      ? 'font-semibold text-foreground after:scale-x-100'
                      : 'text-muted-foreground after:scale-x-0 hover:text-foreground',
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="h-full">
              <article className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full">
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
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
                    <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-primary-pink/10 to-primary-pink/5">
                      <span className="text-muted-foreground text-sm">
                        No image
                      </span>
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
                      {getReadTime(post.content)} phút đọc
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount} lượt xem
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link href="/blog">
            <Button className="rounded-full border-2 border-foreground bg-white px-12 py-4 text-base font-semibold text-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-foreground hover:text-white hover:shadow-xl active:translate-y-0 cursor-pointer">
              Tất cả bài viết
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
