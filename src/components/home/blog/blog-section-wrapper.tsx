import { Suspense } from 'react'
import {
  getPublicBlogPostsAPI,
  getPublicBlogTopicsAPI,
} from '@/lib/apis/server/blog-apis'
import BlogSection from './blog-section'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

async function BlogSectionContent() {
  try {
    // Fetch latest 12 blog posts and active topics
    const [postsResponse, topicsResponse] = await Promise.all([
      getPublicBlogPostsAPI({
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
      }),
      getPublicBlogTopicsAPI({
        limit: 10,
        isActive: true,
      }),
    ])

    const posts: IBlogPostDataType[] =
      (postsResponse as IApiPaginationResponseWrapperType<IBlogPostDataType>)
        ?.data?.items ?? []
    const topics: IBlogTopicDataType[] =
      (topicsResponse as IApiPaginationResponseWrapperType<IBlogTopicDataType>)
        ?.data?.items ?? []

    // Don't render if no posts
    if (posts.length === 0) {
      return null
    }

    return <BlogSection posts={posts} topics={topics} />
  } catch (error) {
    console.error('Error fetching blog data:', error)
    return null
  }
}

function BlogSectionSkeleton() {
  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:mb-16">
          <div className="h-12 w-64 mx-auto bg-gray-200 animate-pulse rounded-lg mb-8" />
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-24 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md">
              <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BlogSectionWrapper() {
  return (
    <Suspense fallback={<BlogSectionSkeleton />}>
      <BlogSectionContent />
    </Suspense>
  )
}

export { BlogSectionSkeleton }
