'use client'

import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'
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

interface BlogTopicsTableProps {
  topics: IBlogTopicDataType[]
  onEdit: (topic: IBlogTopicDataType) => void
  onDelete: (topic: IBlogTopicDataType) => void
}

export function BlogTopicsTable({
  topics,
  onEdit,
  onDelete,
}: BlogTopicsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên chủ đề</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => (
            <TableRow key={topic.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {topic.imageMedia && (
                    <img
                      src={topic.imageMedia.url}
                      alt={topic.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <span className="font-medium">{topic.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground line-clamp-2">
                  {topic.description || '—'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{topic.sortOrder}</span>
              </TableCell>
              <TableCell>
                {topic.isActive ? (
                  <Badge className="gap-1 bg-primary-pink/10 text-primary-pink border-primary-pink/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Hoạt động
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Không hoạt động
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(topic)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(topic)}
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
