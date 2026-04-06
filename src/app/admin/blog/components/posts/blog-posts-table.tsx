'use client'

import { MoreHorizontal, Edit, Trash2, Eye, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { IBlogPostDataType } from '@/lib/types/interfaces/apis/blog.interfaces'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BlogPostsTableProps {
  posts: IBlogPostDataType[]
  onEdit: (post: IBlogPostDataType) => void
  onDelete: (post: IBlogPostDataType) => void
  onViewComments: (post: IBlogPostDataType) => void
}

const statusConfig = {
  [BlogPostStatus.DRAFT]: {
    label: 'Nháp',
    variant: 'secondary' as const,
    className: '',
  },
  [BlogPostStatus.PUBLISHED]: {
    label: 'Đã xuất bản',
    variant: 'default' as const,
    className: 'bg-primary-pink/10 text-primary-pink border-primary-pink/30',
  },
  [BlogPostStatus.ARCHIVED]: {
    label: 'Lưu trữ',
    variant: 'outline' as const,
    className: '',
  },
}

export function BlogPostsTable({
  posts,
  onEdit,
  onDelete,
  onViewComments,
}: BlogPostsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Chủ đề</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium line-clamp-1">{post.title}</span>
                  {post.excerpt && (
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {post.excerpt}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {post.topic ? (
                  <span className="text-sm">{post.topic.name}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusConfig[post.status].variant}
                  className={statusConfig[post.status].className || ''}
                >
                  {statusConfig[post.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {post.viewCount}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewComments(post)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Xem bình luận
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(post)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
