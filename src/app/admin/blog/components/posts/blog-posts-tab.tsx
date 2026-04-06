'use client'

import { useState } from 'react'
import { Loader2, FileText, Plus } from 'lucide-react'
import {
  useBlogPostsQuery,
  useBlogTopicsQuery,
} from '@/hooks/querys/blog.query'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BlogPostsTable } from './blog-posts-table'
import { CreatePostDialog } from './create-post-dialog'
import { EditPostDialog } from './edit-post-dialog'
import { DeletePostDialog } from './delete-post-dialog'
import { ViewCommentsDialog } from './view-comments-dialog'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'
import { TablePagination } from '@/components/table-pagination'

const PAGE_SIZE = 10

export function BlogPostsTab() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<BlogPostStatus | null>(
    null,
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewCommentsDialogOpen, setViewCommentsDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<IBlogPostDataType | null>(
    null,
  )

  const { data: topicsData } = useBlogTopicsQuery({ limit: 100 })
  const { data: postsData, isLoading } = useBlogPostsQuery({
    page,
    limit: pageSize,
    search: searchQuery || undefined,
    topicId: selectedTopicId ?? undefined,
    status: selectedStatus ?? undefined,
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
  const totalCount: number = postsResult?.data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleEdit = (post: IBlogPostDataType) => {
    setSelectedPost(post)
    setEditDialogOpen(true)
  }

  const handleDelete = (post: IBlogPostDataType) => {
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  const handleViewComments = (post: IBlogPostDataType) => {
    setSelectedPost(post)
    setViewCommentsDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full min-w-0">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="max-w-sm"
            />
            <Select
              value={selectedTopicId ?? 'all'}
              onValueChange={(value) => {
                setSelectedTopicId(value === 'all' ? null : value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus ?? 'all'}
              onValueChange={(value) => {
                setSelectedStatus(
                  value === 'all' ? null : (value as BlogPostStatus),
                )
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={BlogPostStatus.DRAFT}>Nháp</SelectItem>
                <SelectItem value={BlogPostStatus.PUBLISHED}>
                  Đã xuất bản
                </SelectItem>
                <SelectItem value={BlogPostStatus.ARCHIVED}>Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            variant="primary-pink"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm bài viết
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <FileText className="h-12 w-12" />
          <p className="text-lg font-medium">Chưa có bài viết nào</p>
          <p className="text-sm">
            {searchQuery
              ? `Không tìm thấy bài viết nào khớp với "${searchQuery}"`
              : 'Nhấn "Thêm bài viết" để tạo bài viết đầu tiên'}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && posts.length > 0 && (
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <BlogPostsTable
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewComments={handleViewComments}
          />

          {/* Pagination */}
          <div className="shrink-0">
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalCount}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
              ariaLabel="Điều hướng phân trang bài viết"
            />
          </div>
        </div>
      )}

      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        topics={topics}
      />

      <EditPostDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        post={selectedPost}
        topics={topics}
      />

      <DeletePostDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        post={selectedPost}
      />

      <ViewCommentsDialog
        open={viewCommentsDialogOpen}
        onOpenChange={setViewCommentsDialogOpen}
        post={selectedPost}
      />
    </div>
  )
}
