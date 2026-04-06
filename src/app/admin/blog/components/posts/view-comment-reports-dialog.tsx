'use client'

import { useState } from 'react'
import {
  Loader2,
  AlertTriangle,
  User,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBlogCommentReportsQuery } from '@/hooks/querys/blog-comment.query'
import { useUpdateBlogCommentReportStatusMutation } from '@/hooks/mutations/admin-blog-comment-mutation'
import { TablePagination } from '@/components/table-pagination'
import type { IBlogCommentDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'
import type { IBlogCommentReportDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import {
  BlogCommentReportReason,
  BlogCommentReportStatus,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

interface ViewCommentReportsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: IBlogCommentDataType | null
}

const PAGE_SIZE = 10

const reasonLabels: Record<BlogCommentReportReason, string> = {
  [BlogCommentReportReason.SPAM]: 'Spam',
  [BlogCommentReportReason.INAPPROPRIATE]: 'Không phù hợp',
  [BlogCommentReportReason.HARASSMENT]: 'Quấy rối',
  [BlogCommentReportReason.MISINFORMATION]: 'Thông tin sai lệch',
  [BlogCommentReportReason.OTHER]: 'Khác',
}

const statusConfig = {
  [BlogCommentReportStatus.PENDING]: {
    label: 'Chờ xử lý',
    variant: 'secondary' as const,
    icon: AlertTriangle,
    className: '',
  },
  [BlogCommentReportStatus.REVIEWED]: {
    label: 'Đã xem xét',
    variant: 'default' as const,
    icon: AlertTriangle,
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  },
  [BlogCommentReportStatus.RESOLVED]: {
    label: 'Đã giải quyết',
    variant: 'default' as const,
    icon: CheckCircle,
    className: 'bg-green-500/10 text-green-500 border-green-500/30',
  },
  [BlogCommentReportStatus.REJECTED]: {
    label: 'Từ chối',
    variant: 'outline' as const,
    icon: XCircle,
    className: '',
  },
}

export function ViewCommentReportsDialog({
  open,
  onOpenChange,
  comment,
}: ViewCommentReportsDialogProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const { data, isLoading } = useBlogCommentReportsQuery({
    commentId: comment?.id,
    page,
    limit: pageSize,
  })

  const updateStatusMutation = useUpdateBlogCommentReportStatusMutation()

  const reportsResult = data as
    | IApiPaginationResponseWrapperType<IBlogCommentReportDataType>
    | undefined
  const reports: IBlogCommentReportDataType[] = reportsResult?.data?.items ?? []
  const totalCount: number = reportsResult?.data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleStatusChange = async (
    reportId: string,
    status: BlogCommentReportStatus,
  ) => {
    await updateStatusMutation.mutateAsync({ id: reportId, data: { status } })
  }

  const getUserInitials = (user: IBlogCommentReportDataType['reporter']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.username?.[0]?.toUpperCase() ?? 'U'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Báo cáo bình luận</DialogTitle>
          {comment && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {comment.content}
            </p>
          )}
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && reports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <AlertTriangle className="h-12 w-12" />
            <p className="text-lg font-medium">Chưa có báo cáo nào</p>
            <p className="text-sm">
              Bình luận này chưa có báo cáo từ người dùng
            </p>
          </div>
        )}

        {!isLoading && reports.length > 0 && (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {reports.map((report) => {
                  const StatusIcon = statusConfig[report.status].icon
                  return (
                    <div
                      key={report.id}
                      className="flex gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                          src={report.reporter.avatar?.media?.url}
                          alt={report.reporter.username}
                        />
                        <AvatarFallback>
                          {getUserInitials(report.reporter)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {report.reporter.firstName}{' '}
                                {report.reporter.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                @{report.reporter.username}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(report.createdAt),
                                'dd/MM/yyyy HH:mm',
                                { locale: vi },
                              )}
                            </span>
                          </div>

                          <Badge
                            variant={statusConfig[report.status].variant}
                            className={
                              statusConfig[report.status].className || ''
                            }
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[report.status].label}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Lý do:</span>
                            <Badge variant="outline">
                              {reasonLabels[report.reason]}
                            </Badge>
                          </div>

                          {report.description && (
                            <div>
                              <span className="text-sm font-medium">
                                Mô tả:
                              </span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {report.description}
                              </p>
                            </div>
                          )}

                          {report.reviewedBy && report.reviewedAt && (
                            <div className="text-xs text-muted-foreground">
                              Đã xem xét bởi{' '}
                              {report.reviewer
                                ? `${report.reviewer.firstName} ${report.reviewer.lastName}`
                                : 'Admin'}{' '}
                              vào{' '}
                              {format(
                                new Date(report.reviewedAt),
                                'dd/MM/yyyy HH:mm',
                                { locale: vi },
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Cập nhật trạng thái:
                          </span>
                          <Select
                            value={report.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                report.id,
                                value as BlogCommentReportStatus,
                              )
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-[180px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={BlogCommentReportStatus.PENDING}
                              >
                                Chờ xử lý
                              </SelectItem>
                              <SelectItem
                                value={BlogCommentReportStatus.REVIEWED}
                              >
                                Đã xem xét
                              </SelectItem>
                              <SelectItem
                                value={BlogCommentReportStatus.RESOLVED}
                              >
                                Đã giải quyết
                              </SelectItem>
                              <SelectItem
                                value={BlogCommentReportStatus.REJECTED}
                              >
                                Từ chối
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="shrink-0 border-t pt-4">
              <TablePagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                ariaLabel="Điều hướng phân trang báo cáo"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
