'use client'

import { useState } from 'react'
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  usePublicBlogPostsQuery,
  usePublicBlogTopicsQuery,
} from '@/hooks/querys/blog.query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogPostCard } from './blog-post-card'
import { BlogTopicFilter } from './blog-topic-filter'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

const PAGE_SIZE = 12

export function BlogListingContent() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const { data: topicsData } = usePublicBlogTopicsQuery({
    limit: 100,
    isActive: true,
  })
  const { data: postsData, isLoading } = usePublicBlogPostsQuery({
    page,
    limit: PAGE_SIZE,
    search: searchQuery || undefined,
    topicId: selectedTopicId ?? undefined,
    sortBy: 'createdAt',
    order: 'desc',
  })

  const topics: IBlogTopicDataType[] =
    (
      topicsData as
        | IApiPaginationResponseWrapperType<IBlogTopicDataType>
        | undefined
    )?.data?.items ?? []
  const postsResult = postsData as
    | IApiPaginationResponseWrapperType<IBlogPostDataType>
    | undefined
  const posts: IBlogPostDataType[] = postsResult?.data?.items ?? []
  const totalCount = postsResult?.data?.totalCount ?? 0
  const totalPages = postsResult?.data?.totalPage ?? 1
  const hasNextPage = postsResult?.data?.hasNextPage ?? false
  const hasPreviousPage = postsResult?.data?.hasPreviousPage ?? false

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Khám phá các bài viết về làm đẹp và chăm sóc da
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9"
                />
              </div>
            </div>
            <BlogTopicFilter
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={(id) => {
                setSelectedTopicId(id)
                setPage(1)
              }}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Không tìm thấy bài viết nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="h-full">
                    <BlogPostCard post={post} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị{' '}
                    <span className="font-medium">
                      {(page - 1) * PAGE_SIZE + 1}–
                      {Math.min(page * PAGE_SIZE, totalCount)}
                    </span>{' '}
                    trong <span className="font-medium">{totalCount}</span> bài
                    viết
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPreviousPage || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      Trang {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={!hasNextPage || isLoading}
                    >
                      Tiếp
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
