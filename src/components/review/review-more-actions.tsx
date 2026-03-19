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
import { IReviewDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { useAuthUser } from '@/hooks/use-auth';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import { EditReviewDialog } from './edit-review-dialog';
import {
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from '@/hooks/mutations/review.mutation';

interface ReviewMoreActionsProps {
  review: IReviewDataType;
  productId: string;
}

export function ReviewMoreActions({
  review,
  productId,
}: ReviewMoreActionsProps) {
  const currentUser = useAuthUser();
  const isOwner = currentUser?.id === review.userId;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useDeleteReviewMutation(review.id, productId);
  const updateMutation = useUpdateReviewMutation(review.id, productId);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleEdit = (data: {
    rating: number;
    title: string;
    comment: string;
  }) => {
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
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
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
        title="Xác nhận xóa đánh giá"
        description="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        isLoading={deleteMutation.isPending}
      />

      {/* Edit Dialog */}
      <EditReviewDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        review={review}
        isLoading={updateMutation.isPending}
      />
    </>
  );
}
