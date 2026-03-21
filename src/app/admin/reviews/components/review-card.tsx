'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Star,
  CheckCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  MoreHorizontal,
  Eye,
  Reply,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IReviewWithProductDataType } from '@/lib/types/interfaces/apis/review.interfaces';

interface ReviewCardProps {
  review: IReviewWithProductDataType;
  onViewDetail: (review: IReviewWithProductDataType) => void;
  onApprove: (review: IReviewWithProductDataType) => void;
  onReject: (review: IReviewWithProductDataType) => void;
  onDelete: (review: IReviewWithProductDataType) => void;
  onReply: (review: IReviewWithProductDataType) => void;
}

export function ReviewCard({
  review,
  onViewDetail,
  onApprove,
  onReject,
  onDelete,
  onReply,
}: ReviewCardProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-50';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setImageDialogOpen(true);
  };

  return (
    <>
      <div
        className='group relative bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300'
      >
        {/* Header - User Info & Status */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10 ring-2 ring-gray-100'>
              <AvatarImage src={review.user?.avatarMedia?.url ?? ''} />
              <AvatarFallback className='bg-muted text-muted-foreground text-sm font-medium'>
                {getInitials(review.user?.firstName, review.user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className='font-semibold text-gray-900 text-sm'>
                {review.user?.firstName} {review.user?.lastName}
              </h4>
              <p className='text-xs text-gray-500'>{review.user?.email}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {review.isApproved ? (
              <Badge
                variant='default'
                className='bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs'
              >
                <CheckCircle className='h-3 w-3 mr-1' />
                Đã duyệt
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className='text-orange-600 border-orange-200 bg-orange-50 text-xs'
              >
                <Clock className='h-3 w-3 mr-1' />
                Chờ duyệt
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => onViewDetail(review)}>
                  <Eye className='h-4 w-4 mr-2' />
                  Xem chi tiết
                </DropdownMenuItem>
                {!review.isApproved ? (
                  <DropdownMenuItem onClick={() => onApprove(review)}>
                    <CheckCircle className='h-4 w-4 mr-2 text-green-600' />
                    Phê duyệt
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onReject(review)}>
                    <Clock className='h-4 w-4 mr-2 text-orange-600' />
                    Hủy duyệt
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onReply(review)}>
                  <Reply className='h-4 w-4 mr-2 text-blue-600' />
                  Phản hồi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(review)}
                  className='text-red-600 focus:text-red-600'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Info */}
        <div className='mb-3 p-3 bg-gray-50 rounded-lg'>
          <p className='text-xs text-gray-500 mb-1'>Sản phẩm</p>
          <p className='font-medium text-sm text-gray-900 line-clamp-1'>
            {review.product?.name}
          </p>
        </div>

        {/* Rating */}
        <div className='flex items-center gap-2 mb-3'>
          <div
            className={`px-2 py-1 rounded-lg flex items-center gap-1 ${getRatingColor(review.rating)}`}
          >
            <Star className='h-3.5 w-3.5 fill-current' />
            <span className='font-bold text-sm'>{review.rating}</span>
          </div>
          <div className='flex'>{getRatingStars(review.rating)}</div>
        </div>

        {/* Review Content */}
        <div className='mb-4'>
          {review.title && (
            <h5 className='font-semibold text-gray-900 mb-1 text-sm'>
              {review.title}
            </h5>
          )}
          <p className='text-sm text-gray-600 line-clamp-3 leading-relaxed'>
            {review.comment || 'Không có nội dung'}
          </p>
        </div>

        {/* Review Images */}
        {review.reviewImages && review.reviewImages.length > 0 && (
          <div className='mb-4'>
            <div className='flex gap-2 flex-wrap'>
              {review.reviewImages.slice(0, 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image.media.url)}
                  className='relative group/image'
                >
                  <div className='relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors'>
                    <Image
                      src={image.media.url}
                      alt={image.alt || `Review image ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                    {index === 3 && review.reviewImages!.length > 4 && (
                      <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                        <span className='text-white text-xs font-medium'>
                          +{review.reviewImages!.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer - Stats & Date */}
        <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
          <div className='flex items-center gap-4 text-xs text-gray-500'>
            <span className='flex items-center gap-1'>
              <ThumbsUp className='h-3.5 w-3.5' />
              {review.helpfulCount} hữu ích
            </span>
            {review.replies && review.replies.length > 0 && (
              <span className='flex items-center gap-1'>
                <MessageSquare className='h-3.5 w-3.5' />
                {review.replies.length} phản hồi
              </span>
            )}
          </div>
          <span className='text-xs text-gray-400'>
            {formatDate(review.createdAt)}
          </span>
        </div>

        {/* Quick Actions - Show on hover */}
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          {/* Actions already in dropdown */}
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className='max-w-3xl p-0 overflow-hidden bg-black/90 border-0'>
          <DialogHeader className='sr-only'>
            <DialogTitle>Hình ảnh đánh giá</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className='relative w-full h-[80vh]'>
              <Image
                src={selectedImage}
                alt='Review image'
                fill
                className='object-contain'
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
