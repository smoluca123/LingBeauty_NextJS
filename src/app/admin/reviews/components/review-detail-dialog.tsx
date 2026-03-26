'use client';

import { useState, useMemo, useTransition } from 'react';
import Image from 'next/image';
import {
  Star,
  Package,
  Calendar,
  ThumbsUp,
  Image as ImageIcon,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Clock,
  Filter,
  ChevronDown,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type {
  IReviewWithProductDataType,
  IReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces';
import { useInfiniteReviewRepliesQuery } from '@/hooks/querys/admin-review.query';
import { useAdminProductByIdQuery } from '@/hooks/querys/admin-product.query';
import { DeleteReviewDialog } from './delete-review-dialog';
import { DeleteReplyDialog } from './delete-reply-dialog';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';

interface ReviewDetailDialogProps {
  review: IReviewWithProductDataType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReplyFilterType = 'all' | 'admin' | 'user';

export function ReviewDetailDialog({
  review,
  open,
  onOpenChange,
}: ReviewDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [replyFilter, setReplyFilter] = useState<ReplyFilterType>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReplyDialogOpen, setDeleteReplyDialogOpen] = useState(false);
  const [selectedReply, setSelectedReply] =
    useState<IReviewReplyDataType | null>(null);

  // ── Infinite Query for Replies ─────────────────────────────────────────────
  const {
    data: repliesInfiniteData,
    isLoading: isLoadingReplies,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error: repliesError,
  } = useInfiniteReviewRepliesQuery(open ? (review?.id ?? null) : null, {
    pageSize: 10,
  });

  const { data: productData, isLoading: isLoadingProduct } =
    useAdminProductByIdQuery(open ? (review?.productId ?? null) : null);

  const product = productData?.data;

  // All replies from infinite query (flatten pages)
  const allReplies = useMemo<IReviewReplyDataType[]>(
    () => repliesInfiniteData?.pages.flatMap((page) => page.data.items) ?? [],
    [repliesInfiniteData],
  );

  // Filter replies client-side
  const filteredReplies = useMemo<IReviewReplyDataType[]>(() => {
    if (replyFilter === 'all') return allReplies;
    if (replyFilter === 'admin') return allReplies.filter((r) => r.isAdmin);
    return allReplies.filter((r) => !r.isAdmin);
  }, [allReplies, replyFilter]);

  const adminReplyCount = useMemo(
    () => allReplies.filter((r) => r.isAdmin).length,
    [allReplies],
  );

  const userReplyCount = useMemo(
    () => allReplies.filter((r) => !r.isAdmin).length,
    [allReplies],
  );

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const fn = firstName?.[0] || '';
    const ln = lastName?.[0] || '';
    return `${fn}${ln}`.toUpperCase() || '?';
  };

  const getFilterLabel = (filter: ReplyFilterType) => {
    switch (filter) {
      case 'admin':
        return 'Quản trị viên';
      case 'user':
        return 'Ngườii dùng';
      default:
        return 'Tất cả phản hồi';
    }
  };

  const handleFilterChange = (filter: ReplyFilterType) => {
    startTransition(() => {
      setReplyFilter(filter);
    });
  };

  // Guard: don't render content if no review
  if (!review) return null;

  const userName = review.user
    ? `${review.user.firstName ?? ''} ${review.user.lastName ?? ''}`.trim()
    : 'Ngườii dùng ẩn danh';

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReplyFilter('all');
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none sm:border border-border/10'>
        <DialogHeader className='px-6 py-4 border-b bg-muted/20 flex flex-row items-center justify-between'>
          <DialogTitle className='text-lg font-bold tracking-tight'>
            Chi tiết đánh giá
          </DialogTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setDeleteDialogOpen(true)}
            className='h-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-none'
          >
            <Trash2 className='h-3.5 w-3.5 mr-2' />
            Xóa đánh giá
          </Button>
        </DialogHeader>

        <ScrollArea className='flex-1 overflow-y-auto w-full'>
          <div className='p-6 space-y-8'>
            {/* Header: User & Status */}
            <div className='flex items-start justify-between gap-4'>
              <div className='flex items-start gap-4'>
                <Avatar className='h-12 w-12 border ring-2 ring-muted/50'>
                  <AvatarImage src={review.user?.avatarMedia?.url ?? ''} />
                  <AvatarFallback className='text-lg bg-pink-50 text-pink-600 font-bold'>
                    {getInitials(review.user?.firstName, review.user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                  <h3 className='font-bold text-lg flex flex-wrap items-center gap-2 leading-none'>
                    {userName}
                    {review.isVerified && (
                      <Badge
                        variant='secondary'
                        className='text-[10px] uppercase font-bold tracking-widest h-5 px-2 bg-green-50 text-green-700 hover:bg-green-100 border-none'
                      >
                        <CheckCircle2 className='w-3 h-3 mr-1' />
                        Đã mua
                      </Badge>
                    )}
                  </h3>
                  <div className='flex items-center flex-wrap gap-4 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5 opacity-70' />
                      {formatDate(review.createdAt)}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <ThumbsUp className='h-3.5 w-3.5 opacity-70' />
                      {review.helpfulCount} ngườii thấy hữu ích
                    </span>
                  </div>
                </div>
              </div>

              <div className='shrink-0'>
                {review.isApproved ? (
                  <Badge className='bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold text-[10px] uppercase tracking-wider py-1'>
                    <CheckCircle2 className='w-3.5 h-3.5 mr-1.5' />
                    Đã phê duyệt
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='text-orange-600 border-orange-200 bg-orange-50 font-bold text-[10px] uppercase tracking-wider py-1'
                  >
                    <Clock className='w-3.5 h-3.5 mr-1.5' />
                    Chờ phê duyệt
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating and Content */}
            <div className='space-y-4 bg-muted/10 p-5 rounded-2xl border border-border/40'>
              <div className='flex items-center gap-1.5'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/20'
                    }`}
                  />
                ))}
                <span className='ml-2 font-bold text-lg text-amber-600'>
                  {review.rating}/5
                </span>
              </div>

              {review.title && (
                <h4 className='font-bold text-base leading-tight'>
                  {review.title}
                </h4>
              )}

              {review.comment && (
                <p className='text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm'>
                  {review.comment}
                </p>
              )}
            </div>

            {/* Images */}
            {review.reviewImages && review.reviewImages.length > 0 && (
              <div className='space-y-3'>
                <h4 className='font-bold text-[10px] text-muted-foreground flex items-center gap-2 uppercase tracking-widest'>
                  <ImageIcon className='h-3.5 w-3.5' />
                  Hình ảnh đính kèm ({review.reviewImages.length})
                </h4>
                <div className='flex flex-wrap gap-3'>
                  {review.reviewImages.map((image) => (
                    <div
                      key={image.id}
                      className='h-24 w-24 rounded-xl overflow-hidden border border-border/60 bg-muted group relative shadow-sm hover:shadow-md transition-all'
                    >
                      <Image
                        src={image.media?.url || ''}
                        alt={image.alt || 'Review image'}
                        fill
                        className='object-cover transition-transform group-hover:scale-110'
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Card */}
            <div className='space-y-3 pt-2'>
              <h4 className='font-bold text-[10px] text-muted-foreground flex items-center gap-2 uppercase tracking-widest'>
                <Package className='h-3.5 w-3.5' />
                Sản phẩm được đánh giá
              </h4>
              <div className='flex items-center gap-4 p-4 rounded-2xl border border-border/60 bg-card hover:bg-muted/5 hover:border-primary/20 transition-all'>
                {isLoadingProduct ? (
                  <div className='h-20 w-20 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-dashed'>
                    <Loader2 className='h-6 w-6 animate-spin text-muted-foreground/30' />
                  </div>
                ) : (
                  <div className='h-20 w-20 rounded-xl overflow-hidden border border-border/40 bg-muted shrink-0 relative'>
                    <Image
                      src={product?.primaryImage?.media?.url || ''}
                      alt={product?.name || 'Product'}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}

                <div className='flex-1 min-w-0 space-y-2'>
                  {isLoadingProduct ? (
                    <div className='space-y-2'>
                      <div className='h-4 w-3/4 bg-muted animate-pulse rounded' />
                      <div className='h-3 w-1/2 bg-muted animate-pulse rounded' />
                    </div>
                  ) : (
                    <>
                      <p className='text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors'>
                        {product?.name || review.product?.name}
                      </p>
                      <div className='flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground'>
                        {product?.sku && (
                          <span className='flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/50'>
                            <span className='font-bold opacity-60'>SKU:</span>{' '}
                            {product.sku}
                          </span>
                        )}
                        {product?.brand && (
                          <span className='flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/50'>
                            <span className='font-bold opacity-60'>Hãng:</span>{' '}
                            {product.brand.name}
                          </span>
                        )}
                        <span className='font-bold text-primary'>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(Number(product?.basePrice || 0))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Replies Section */}
            <div className='space-y-4 pt-4 border-t border-dashed'>
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <h4 className='font-bold text-[10px] text-muted-foreground flex items-center gap-2 uppercase tracking-widest'>
                  <MessageSquare className='h-3.5 w-3.5' />
                  Lịch sử phản hồi
                  <Badge
                    variant='secondary'
                    className='h-4 px-1.5 text-[9px] min-w-[18px] justify-center'
                  >
                    {allReplies.length}
                  </Badge>
                </h4>

                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => refetch()}
                    disabled={isLoadingReplies}
                    className='h-8 w-8 rounded-full border border-border/40 hover:bg-muted'
                  >
                    <RefreshCcw
                      className={`h-3.5 w-3.5 ${isLoadingReplies ? 'animate-spin' : 'opacity-60'}`}
                    />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8 gap-2 rounded-full px-4 text-xs font-semibold border-border/60'
                      >
                        <Filter className='h-3 w-3' />
                        {getFilterLabel(replyFilter)}
                        <ChevronDown className='h-3 w-3 opacity-50' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='end'
                      className='min-w-[180px] p-1.5 rounded-xl'
                    >
                      <DropdownMenuItem
                        onClick={() => handleFilterChange('all')}
                        className={`rounded-lg px-3 py-2 ${replyFilter === 'all' ? 'bg-primary/5 text-primary font-bold' : ''}`}
                      >
                        <span className='flex-1'>Tất cả</span>
                        {replyFilter === 'all' && (
                          <CheckCircle2 className='h-3.5 w-3.5' />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFilterChange('admin')}
                        className={`rounded-lg px-3 py-2 ${replyFilter === 'admin' ? 'bg-primary/5 text-primary font-bold' : ''}`}
                      >
                        <span className='flex-1'>Quản trị viên</span>
                        {adminReplyCount > 0 && (
                          <Badge
                            variant='secondary'
                            className='h-4 px-1 rounded text-[9px]'
                          >
                            {adminReplyCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFilterChange('user')}
                        className={`rounded-lg px-3 py-2 ${replyFilter === 'user' ? 'bg-primary/5 text-primary font-bold' : ''}`}
                      >
                        <span className='flex-1'>Ngườii dùng</span>
                        {userReplyCount > 0 && (
                          <Badge
                            variant='secondary'
                            className='h-4 px-1 rounded text-[9px]'
                          >
                            {userReplyCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Replies List */}
              {isLoadingReplies || isPending ? (
                <div className='flex flex-col items-center justify-center py-12 gap-3 opacity-60'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary/30' />
                  <span className='text-xs font-bold tracking-widest text-muted-foreground uppercase'>
                    {isPending ? 'Đang lọc...' : 'Đang tải phản hồi...'}
                  </span>
                </div>
              ) : repliesError ? (
                <div className='flex flex-col items-center justify-center py-8 gap-3'>
                  <AlertCircle className='h-8 w-8 text-destructive/60' />
                  <p className='text-sm text-muted-foreground text-center'>
                    {repliesError instanceof Error
                      ? repliesError.message
                      : 'Không thể tải phản hồi. Vui lòng thử lại.'}
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => refetch()}
                    className='mt-2'
                  >
                    <RefreshCcw className='h-3.5 w-3.5 mr-2' />
                    Thử lại
                  </Button>
                </div>
              ) : filteredReplies.length === 0 ? (
                <div className='text-center py-12 bg-muted/10 rounded-2xl border border-dashed border-border/60'>
                  <MessageSquare
                    className='h-10 w-10 mx-auto mb-3 opacity-20'
                    strokeWidth={1}
                  />
                  <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                    {replyFilter === 'all'
                      ? 'Chưa có phản hồi nào'
                      : replyFilter === 'admin'
                        ? 'Không có từ quản trị'
                        : 'Không có từ ngườii dùng'}
                  </p>
                </div>
              ) : (
                <InfiniteScrollContainer
                  onBottomReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                      fetchNextPage();
                    }
                  }}
                  isShowInViewElement={hasNextPage && !isFetchingNextPage}
                  rootMargin='100px'
                >
                  <div className='space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/50 before:bg-linear-to-b before:from-transparent before:via-border/50 before:to-transparent'>
                    {filteredReplies.map((reply: IReviewReplyDataType) => (
                      <div key={reply.id} className='relative pl-10 group'>
                        <div className='absolute left-2.5 top-0 w-5 h-5 rounded-full border-4 border-background bg-border/80 ring-2 ring-background z-10 transition-colors group-hover:bg-primary/60' />

                        <div
                          className={`rounded-2xl p-4 border transition-all ${
                            reply.isAdmin
                              ? 'bg-primary/5 border-primary/10 shadow-sm'
                              : 'bg-muted/10 border-border/40'
                          }`}
                        >
                          <div className='flex flex-wrap items-center justify-between gap-3 mb-3'>
                            <div className='flex items-center gap-2.5'>
                              <Avatar className='h-8 w-8 border ring-2 ring-background shadow-sm'>
                                <AvatarImage
                                  src={reply.user?.avatarMedia?.url ?? ''}
                                />
                                <AvatarFallback className='text-[10px] bg-muted font-bold'>
                                  {getInitials(
                                    reply.user?.firstName,
                                    reply.user?.lastName,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div className='flex flex-col'>
                                <span className='font-bold text-sm leading-none flex items-center gap-2'>
                                  {reply.user?.firstName} {reply.user?.lastName}
                                  {reply.isAdmin && (
                                    <Badge
                                      className='text-[9px] uppercase font-black tracking-tighter h-4 px-1 border-none bg-primary text-primary-foreground'
                                      variant='default'
                                    >
                                      <ShieldCheck className='w-2.5 h-2.5 mr-0.5' />
                                      Admin
                                    </Badge>
                                  )}
                                </span>
                                <span className='text-[10px] text-muted-foreground font-medium opacity-70'>
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-7 w-7 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hover:bg-muted'
                                >
                                  <MoreVertical className='h-3.5 w-3.5' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align='end'
                                className='rounded-xl p-1.5'
                              >
                                <DropdownMenuItem
                                  className='text-destructive focus:text-destructive focus:bg-destructive/5 rounded-lg'
                                  onClick={() => {
                                    setSelectedReply(reply);
                                    setDeleteReplyDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className='h-3.5 w-3.5 mr-2' />
                                  Xóa phản hồi
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className='text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed px-0.5'>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfiniteScrollContainer>
              )}

              {/* Loading More Indicator */}
              {isFetchingNextPage && (
                <div className='flex flex-col items-center justify-center py-6 gap-2'>
                  <Loader2 className='h-5 w-5 animate-spin text-primary/50' />
                  <span className='text-xs text-muted-foreground'>
                    Đang tải thêm...
                  </span>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      <DeleteReviewDialog
        review={review}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => onOpenChange(false)}
      />

      <DeleteReplyDialog
        reply={selectedReply}
        reviewId={review?.id ?? ''}
        open={deleteReplyDialogOpen}
        onOpenChange={setDeleteReplyDialogOpen}
      />
    </Dialog>
  );
}
