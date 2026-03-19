'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Flag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IReviewReplyDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { useAuthUser } from '@/hooks/use-auth';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import { EditReplyDialog } from './edit-reply-dialog';
import {
  useDeleteReviewReplyMutation,
  useUpdateReviewReplyMutation,
} from '@/hooks/mutations/review.mutation';

interface ReplyMoreActionsProps {
  reply: IReviewReplyDataType;
  reviewId: string;
}

export function ReplyMoreActions({ reply, reviewId }: ReplyMoreActionsProps) {
  const currentUser = useAuthUser();
  const isOwner = currentUser?.id === reply.userId;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useDeleteReviewReplyMutation(reply.id, reviewId);
  const updateMutation = useUpdateReviewReplyMutation(reply.id, reviewId);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleEdit = (data: { content: string }) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      },
    });
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    alert('Chức năng báo cáo đang được phát triển');
  };

  // Don't show menu if user is not authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-3 w-3" />
            <span className="sr-only">Thêm hành động</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwner && (
            <>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleReport}>
            <Flag className="mr-2 h-4 w-4" />
            Báo cáo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa phản hồi"
        description="Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác."
        isLoading={deleteMutation.isPending}
      />

      {/* Edit Dialog */}
      <EditReplyDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        reply={reply}
        isLoading={updateMutation.isPending}
      />
    </>
  );
}
