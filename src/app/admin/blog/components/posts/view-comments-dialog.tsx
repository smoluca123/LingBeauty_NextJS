'use client'

import { useState } from 'react'
import {
  Loader2,
  MessageSquare,
  Trash2,
  User,
  MoreHorizontal,
  AlertTriangle,
  Pencil,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAdminBlogCommentsQuery } from '@/hooks/querys/blog-comment.query'
import {
  useAdminUpdateBlogCommentMutation,
  useAdminDeleteBlogCommentMutation,
} from '@/hooks/mutations/admin-blog-comment-mutation'
import { TablePagination } from '@/components/table-pagination'
import type { IBlogPostDataType } from '@/lib/types/interfaces/apis/blog.interfaces'
import type { IBlogCommentDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { ViewCommentReportsDialog } from './view-comment-reports-dialog'
import { EditCommentDialog } from './edit-comment-dialog'

interface ViewCommentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: IBlogPostDataType | null
}

const PAGE_SIZE = 10

export function ViewCommentsDialog({
  open,
  onOpenChange,
  post,
}: ViewCommentsDialogProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewReportsDialogOpen, setViewReportsDialogOpen] = useState(false)
  const [selectedComment, setSelectedComment] =
    useState<IBlogCommentDataType | null>(null)

  const { data, isLoading } = useAdminBlogCommentsQuery({
    postId: post?.id,
    page,
    limit: pageSize,
  })

  const deleteMutation = useAdminDeleteBlogCommentMutation()

  const commentsResult = data as
    | IApiPaginationResponseWrapperType<IBlogCommentDataType>
    | undefined
  const comments: IBlogCommentDataType[] = commentsResult?.data?.items ?? []
  const totalCount: number = commentsResult?.data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleDeleteClick = (comment: IBlogCommentDataType) => {
    setSelectedComment(comment)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (comment: IBlogCommentDataType) => {
    setSelectedComment(comment)
    setEditDialogOpen(true)
  }

  const handleViewReportsClick = (comment: IBlogCommentDataType) => {
    setSelectedComment(comment)
    setViewReportsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedComment) return

    await deleteMutation.mutateAsync(selectedComment.id)
    setDeleteDialogOpen(false)
    setSelectedComment(null)
  }

  const getUserInitials = (user: IBlogCommentDataType['user']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.username?.[0]?.toUpperCase() ?? 'U'
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Bình luận của bài viết</DialogTitle>
            {post && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {post.title}
              </p>
            )}
          </DialogHeader>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <MessageSquare className="h-12 w-12" />
              <p className="text-lg font-medium">Chưa có bình luận nào</p>
              <p className="text-sm">
                Bài viết này chưa có bình luận từ người dùng
              </p>
            </div>
          )}

          {!isLoading && comments.length > 0 && (
            <div className="flex flex-col gap-4 flex-1 min-h-0">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                          src={comment.user.avatar?.media?.url}
                          alt={comment.user.username}
                        />
                        <AvatarFallback>
                          {getUserInitials(comment.user)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment.user.firstName} {comment.user.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                @{comment.user.username}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(comment.createdAt),
                                'dd/MM/yyyy HH:mm',
                                { locale: vi },
                              )}
                            </span>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditClick(comment)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Sửa bình luận
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewReportsClick(comment)}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Xem báo cáo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(comment)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa bình luận
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-sm mt-2 whitespace-pre-wrap wrap-break-word">
                          {comment.content}
                        </p>

                        {comment.parentId && (
                          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Phản hồi bình luận khác</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                  ariaLabel="Điều hướng phân trang bình luận"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <AlertDialogTitle className="text-lg">
                  Xóa bình luận
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm mt-1">
                  Hành động này không thể hoàn tác
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {selectedComment && (
            <div className="my-4 rounded-lg border bg-muted/50 p-3">
              <div className="flex items-start gap-2 mb-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage
                    src={selectedComment.user.avatar?.media?.url}
                    alt={selectedComment.user.username}
                  />
                  <AvatarFallback>
                    {getUserInitials(selectedComment.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {selectedComment.user.firstName}{' '}
                    {selectedComment.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{selectedComment.user.username}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {selectedComment.content}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Xóa bình luận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditCommentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        comment={selectedComment}
      />

      <ViewCommentReportsDialog
        open={viewReportsDialogOpen}
        onOpenChange={setViewReportsDialogOpen}
        comment={selectedComment}
      />
    </>
  )
}
