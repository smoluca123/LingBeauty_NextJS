'use client';

import { useState } from 'react';
import {
  Star,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { IReviewWithProductDataType } from '@/lib/types/interfaces/apis/review.interfaces';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReviewTableProps {
  reviews: IReviewWithProductDataType[];
  isLoading: boolean;
  onViewDetail: (review: IReviewWithProductDataType) => void;
  onApprove: (review: IReviewWithProductDataType) => void;
  onReject: (review: IReviewWithProductDataType) => void;
  onDelete: (review: IReviewWithProductDataType) => void;
  onReply: (review: IReviewWithProductDataType) => void;
}

export function ReviewTable({
  reviews,
  isLoading,
  onViewDetail,
  onApprove,
  onReject,
  onDelete,
  onReply,
}: ReviewTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getAvatarUrl = (user: IReviewWithProductDataType['user']) => {
    return user?.avatarMedia?.url ?? '';
  };

  if (isLoading) {
    return <ReviewTableSkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <MessageSquare className='h-12 w-12 text-muted-foreground/50 mb-4' />
        <h3 className='text-lg font-medium'>Không tìm thấy đánh giá nào</h3>
        <p className='text-sm text-muted-foreground mt-1'>
          Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className='rounded-lg border bg-card w-full overflow-x-auto'>
        <Table className='min-w-max'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead className='min-w-[200px]'>Người đánh giá</TableHead>
              <TableHead className='min-w-[200px]'>Sản phẩm</TableHead>
              <TableHead className='w-[100px]'>Đánh giá</TableHead>
              <TableHead className='min-w-[250px]'>Nội dung</TableHead>
              <TableHead className='w-[140px]'>Trạng thái</TableHead>
              <TableHead className='w-[120px]'>Ngày tạo</TableHead>
              <TableHead className='w-[120px] text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow
                key={review.id}
                onMouseEnter={() => setHoveredRow(review.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={hoveredRow === review.id ? 'bg-muted/50' : ''}
              >
                <TableCell className='font-mono text-xs'>
                  {review.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8 ring-1 ring-border'>
                      <AvatarImage src={getAvatarUrl(review.user)} />
                      <AvatarFallback className='text-[10px] bg-muted'>
                        {getInitials(
                          review.user?.firstName,
                          review.user?.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {review.user?.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium line-clamp-1 max-w-[200px]'>
                      {review.product?.name}
                    </span>
                    {review.reviewImages?.length > 0 && (
                      <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <ImageIcon className='h-3 w-3' />
                        {review.reviewImages.length} ảnh
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`flex items-center gap-1.5 font-bold ${getRatingColor(review.rating)}`}
                  >
                    <Star className='h-4 w-4 fill-current' />
                    {review.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='max-w-[300px] space-y-0.5'>
                    {review.title && (
                      <p className='text-sm font-semibold line-clamp-1'>
                        {review.title}
                      </p>
                    )}
                    <p className='text-xs text-muted-foreground line-clamp-2 leading-relaxed'>
                      {review.comment || 'Không có nội dung'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {review.isApproved ? (
                    <Badge
                      variant='default'
                      className='bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[10px] uppercase font-bold tracking-wider'
                    >
                      <CheckCircle className='h-3 w-3 mr-1' />
                      Đã duyệt
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='text-orange-600 border-orange-200 bg-orange-50 text-[10px] uppercase font-bold tracking-wider'
                    >
                      <Clock className='h-3 w-3 mr-1' />
                      Chờ duyệt
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-xs text-muted-foreground'>
                  {formatDate(review.createdAt)}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => onViewDetail(review)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xem chi tiết</TooltipContent>
                    </Tooltip>

                    {!review.isApproved ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-green-600 hover:bg-green-50'
                            onClick={() => onApprove(review)}
                          >
                            <CheckCircle className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Phê duyệt</TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-orange-600 hover:bg-orange-50'
                            onClick={() => onReject(review)}
                          >
                            <XCircle className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Từ chối</TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => onReply(review)}
                        >
                          <MessageSquare className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Phản hồi</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-destructive hover:bg-destructive/5'
                          onClick={() => onDelete(review)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xóa</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}

function ReviewTableSkeleton() {
  return (
    <div className='rounded-lg border bg-card w-full overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead className='min-w-[200px]'>Người đánh giá</TableHead>
            <TableHead className='min-w-[200px]'>Sản phẩm</TableHead>
            <TableHead className='w-[100px]'>Đánh giá</TableHead>
            <TableHead className='min-w-[250px]'>Nội dung</TableHead>
            <TableHead className='w-[140px]'>Trạng thái</TableHead>
            <TableHead className='w-[120px]'>Ngày tạo</TableHead>
            <TableHead className='w-[120px] text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className='h-4 w-16' />
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <div className='space-y-1.5'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='space-y-1.5'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 w-10 rounded-md' />
              </TableCell>
              <TableCell>
                <div className='space-y-1.5'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-3 w-32' />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-24 rounded-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-20' />
              </TableCell>
              <TableCell>
                <div className='flex justify-end gap-1'>
                  <Skeleton className='h-8 w-8 rounded-md' />
                  <Skeleton className='h-8 w-8 rounded-md' />
                  <Skeleton className='h-8 w-8 rounded-md' />
                  <Skeleton className='h-8 w-8 rounded-md' />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
