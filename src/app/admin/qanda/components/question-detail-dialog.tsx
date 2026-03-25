'use client';

import {
  MessageSquare,
  Package,
  User,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Tag,
  Box,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IProductQuestionWithProduct,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces';
import { useAdminProductByIdQuery } from '@/hooks/querys/admin-product.query';
import { useAuthUser } from '@/hooks/use-auth';

interface QuestionDetailDialogProps {
  question: IProductQuestionWithProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionDetailDialog({
  question,
  open,
  onOpenChange,
}: QuestionDetailDialogProps) {
  // Fetch full product details
  const { data: productData, isLoading: isLoadingProduct } =
    useAdminProductByIdQuery(question?.productId ?? null);

  const product = productData?.data;

  if (!question) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5' />
            Chi tiết câu hỏi
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status Badge */}
          <div className='flex items-center gap-2'>
            {question.status === ProductQuestionStatus.ANSWERED ? (
              <Badge variant='primary-pink'>
                <CheckCircle className='h-3 w-3 mr-1' />
                Đã trả lời
              </Badge>
            ) : (
              <Badge variant='secondary'>
                <Clock className='h-3 w-3 mr-1' />
                Chờ trả lời
              </Badge>
            )}
            {question.isPublic && <Badge variant='outline'>Công khai</Badge>}
          </div>

          {/* User Info */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <User className='h-4 w-4 text-muted-foreground' />
              Người hỏi
            </div>
            <div className='pl-6'>
              <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg border'>
                <Avatar className='h-12 w-12 ring-2 ring-background'>
                  {question.user?.avatarMedia?.url && (
                    <AvatarImage
                      src={question.user.avatarMedia.url}
                      alt={`${question.user.firstName} ${question.user.lastName}`}
                    />
                  )}
                  <AvatarFallback className='text-sm font-semibold'>
                    {getInitials(
                      question.user?.firstName,
                      question.user?.lastName,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <div className='font-semibold text-base'>
                    {question.user?.firstName} {question.user?.lastName}
                  </div>
                  <div className='text-sm text-muted-foreground space-y-0.5'>
                    {question.user?.email && (
                      <div className='truncate'>{question.user.email}</div>
                    )}
                    <div className='font-mono text-xs'>
                      ID: {question.userId.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Info */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Package className='h-4 w-4 text-muted-foreground' />
              Sản phẩm
            </div>
            {isLoadingProduct ? (
              <div className='pl-6'>
                <div className='flex items-start gap-4 p-4 bg-muted/30 rounded-lg border'>
                  <Skeleton className='h-24 w-24 rounded-lg' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                    <Skeleton className='h-4 w-1/3' />
                  </div>
                </div>
              </div>
            ) : product ? (
              <div className='pl-6'>
                <div className='flex items-start gap-4 p-4 bg-muted/30 rounded-lg border'>
                  {product.images?.[0]?.media?.url ? (
                    <div className='relative h-24 w-24 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-white shrink-0'>
                      <img
                        src={product.images[0].media.url}
                        alt={product.name}
                        className='h-full w-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className='h-24 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0'>
                      <Package className='h-8 w-8 text-muted-foreground' />
                    </div>
                  )}
                  <div className='flex-1 min-w-0 space-y-3'>
                    <div>
                      <div className='font-semibold text-base leading-tight mb-1'>
                        {product.name}
                      </div>
                      {product.description && (
                        <div className='text-xs text-muted-foreground line-clamp-2'>
                          {product.description}
                        </div>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      {product.price && (
                        <div className='flex items-center gap-1.5'>
                          <DollarSign className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='font-semibold text-primary-pink'>
                            {product.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      )}
                      {product.sku && (
                        <div className='flex items-center gap-1.5'>
                          <Tag className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='font-mono text-xs'>
                            {product.sku}
                          </span>
                        </div>
                      )}
                      {product.stock !== undefined && (
                        <div className='flex items-center gap-1.5'>
                          <Box className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='text-xs'>
                            Kho:{' '}
                            <span className='font-medium'>{product.stock}</span>
                          </span>
                        </div>
                      )}
                      {product.brand && (
                        <div className='flex items-center gap-1.5'>
                          <Package className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='text-xs'>{product.brand.name}</span>
                        </div>
                      )}
                    </div>

                    <div className='flex flex-wrap gap-1.5'>
                      <span className='font-mono text-xs bg-muted px-2 py-0.5 rounded border'>
                        {product.slug}
                      </span>
                      <span className='font-mono text-xs bg-muted px-2 py-0.5 rounded border'>
                        ID: {product.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='pl-6 text-sm text-muted-foreground'>
                Không tìm thấy thông tin sản phẩm
              </div>
            )}
          </div>

          <Separator />

          {/* Question */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <MessageSquare className='h-4 w-4 text-muted-foreground' />
              Câu hỏi
            </div>
            <div className='pl-6'>
              <div className='text-sm leading-relaxed p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg'>
                {question.question}
              </div>
            </div>
          </div>

          {/* Answer */}
          {question.answer && (
            <>
              <Separator />
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <CheckCircle className='h-4 w-4 text-primary-pink' />
                  Câu trả lời
                </div>
                <div className='pl-6 space-y-3'>
                  <div className='text-sm leading-relaxed bg-primary-pink/10 border border-primary-pink/20 p-4 rounded-lg'>
                    {question.answer}
                  </div>
                  {question.answeredByUser && (
                    <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg border'>
                      <Avatar className='h-10 w-10 ring-2 ring-background'>
                        {question.answeredByUser.avatarMedia?.url && (
                          <AvatarImage
                            src={question.answeredByUser.avatarMedia.url}
                            alt={`${question.answeredByUser.firstName} ${question.answeredByUser.lastName}`}
                          />
                        )}
                        <AvatarFallback className='text-xs font-semibold'>
                          {getInitials(
                            question.answeredByUser.firstName,
                            question.answeredByUser.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <div className='font-semibold text-sm'>
                          {question.answeredByUser.firstName}{' '}
                          {question.answeredByUser.lastName}
                        </div>
                        <div className='text-xs text-muted-foreground flex items-center gap-1'>
                          <CheckCircle className='h-3 w-3 text-primary-pink' />
                          Quản trị viên
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className='space-y-2 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>Ngày tạo: {formatDate(question.createdAt)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>Cập nhật: {formatDate(question.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
