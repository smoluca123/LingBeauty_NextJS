'use client'

import { useState } from 'react'
import { Loader2, FolderTree, Plus } from 'lucide-react'
import { useBlogTopicsQuery } from '@/hooks/querys/blog.query'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BlogTopicsTable } from './blog-topics-table'
import { CreateTopicDialog } from './create-topic-dialog'
import { EditTopicDialog } from './edit-topic-dialog'
import { DeleteTopicDialog } from './delete-topic-dialog'

export function BlogTopicsTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<IBlogTopicDataType | null>(
    null,
  )

  const { data: topicsData, isLoading } = useBlogTopicsQuery({
    limit: 100,
    search: searchQuery || undefined,
  })

  const topicsResult = topicsData as
    | IApiPaginationResponseWrapperType<IBlogTopicDataType>
    | undefined
  const topics: IBlogTopicDataType[] = topicsResult?.data?.items ?? []

  const handleEdit = (topic: IBlogTopicDataType) => {
    setSelectedTopic(topic)
    setEditDialogOpen(true)
  }

  const handleDelete = (topic: IBlogTopicDataType) => {
    setSelectedTopic(topic)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Tìm kiếm chủ đề..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => setCreateDialogOpen(true)}
          variant="primary-pink"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm chủ đề
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && topics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <FolderTree className="h-12 w-12" />
          <p className="text-lg font-medium">Chưa có chủ đề nào</p>
          <p className="text-sm">
            {searchQuery
              ? `Không tìm thấy chủ đề nào khớp với "${searchQuery}"`
              : 'Nhấn "Thêm chủ đề" để tạo chủ đề đầu tiên'}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && topics.length > 0 && (
        <BlogTopicsTable
          topics={topics}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CreateTopicDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        topics={topics}
      />

      <EditTopicDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        topic={selectedTopic}
        topics={topics}
      />

      <DeleteTopicDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        topic={selectedTopic}
      />
    </div>
  )
}
