'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { MessageSquare, MoreVertical, Pencil, Trash2, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth.store'
import { CommentForm } from './comment-form'
import { CommentReplies } from './comment-replies'
import { EditCommentDialog } from './edit-comment-dialog'
import { DeleteCommentDialog } from './delete-comment-dialog'
import { ReportCommentDialog } from './report-comment-dialog'
import type { IBlogCommentDataType } from '@/lib/types/interfaces/apis/blog-comment.interfaces'
import UserAvatar from '@/components/user-avatar'

interface CommentItemProps {
  comment: IBlogCommentDataType
  postId: string
  isReply?: boolean
}

export function CommentItem({ comment, postId, isReply }: CommentItemProps) {
  const { user } = useAuthStore()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)

  const isOwner = user?.id === comment.userId
  const fullName = `${comment.user.firstName} ${comment.user.lastName}`.trim()
  const displayName = fullName || comment.user.username
  // const initials = fullName
  //   ? `${comment.user.firstName[0]}${comment.user.lastName[0]}`
  //   : comment.user.username[0]

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: vi,
  })

  return (
    <div className={isReply ? 'ml-8' : ''}>
      <div className="flex gap-3">
        <UserAvatar
          avatarUrl={comment.user.avatar?.media.url}
          fallbackName={displayName}
        />

        <div className="flex-1 space-y-2">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span className="font-semibold text-sm">{displayName}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {timeAgo}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwner ? (
                    <>
                      <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                      <Flag className="h-4 w-4 mr-2" />
                      Báo cáo
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>

          {!isReply && user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-8 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Trả lời
            </Button>
          )}

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                placeholder="Viết câu trả lời..."
                onSuccess={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {!isReply && (
            <CommentReplies commentId={comment.id} postId={postId} />
          )}
        </div>
      </div>

      <EditCommentDialog
        comment={comment}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteCommentDialog
        commentId={comment.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />

      <ReportCommentDialog
        commentId={comment.id}
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />
    </div>
  )
}
