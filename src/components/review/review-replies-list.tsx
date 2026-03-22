'use client';

import { IReviewReplyDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ReplyMoreActions } from './reply-more-actions';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { hasAdminRole } from '@/lib/utils';

interface ReviewRepliesListProps {
  replies: IReviewReplyDataType[];
  reviewId: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function ReviewRepliesList({
  replies,
  reviewId,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: ReviewRepliesListProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <InfiniteScrollContainer
        onBottomReached={() => {
          if (hasMore && !isLoadingMore && onLoadMore) {
            onLoadMore();
          }
        }}
        isShowInViewElement={hasMore && !isLoadingMore}
      >
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.user.avatarMedia?.url} />
                <AvatarFallback className="bg-primary-pink/10 text-primary-pink text-xs">
                  {getInitials(reply.user.firstName, reply.user.lastName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {reply.user.firstName} {reply.user.lastName}
                    </span>
                    {hasAdminRole(reply.user.roleAssignments) && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary-pink/10 text-primary-pink border-0"
                      >
                        Quản trị viên
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <ReplyMoreActions reply={reply} reviewId={reviewId} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScrollContainer>

      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
