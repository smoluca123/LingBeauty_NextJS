'use client';

import { useState } from 'react';
import { MessageSquare, Eye, CheckCircle, Clock, Trash2 } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  IProductQuestionWithProduct,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces';
import Image from 'next/image';

interface QandATableProps {
  questions: IProductQuestionWithProduct[];
  isLoading: boolean;
  onViewDetail: (question: IProductQuestionWithProduct) => void;
  onAnswer: (question: IProductQuestionWithProduct) => void;
  onDelete: (question: IProductQuestionWithProduct) => void;
}

export function QandATable({
  questions,
  isLoading,
  onViewDetail,
  onAnswer,
  onDelete,
}: QandATableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <QandATableSkeleton />;
  }

  if (questions.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <MessageSquare className='h-12 w-12 text-muted-foreground/50 mb-4' />
        <h3 className='text-lg font-medium'>Không tìm thấy câu hỏi nào</h3>
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
              <TableHead className='min-w-[200px]'>Người hỏi</TableHead>
              <TableHead className='min-w-[200px]'>Sản phẩm</TableHead>
              <TableHead className='min-w-[300px]'>Câu hỏi</TableHead>
              <TableHead className='w-[140px]'>Trạng thái</TableHead>
              <TableHead className='w-40'>Ngày tạo</TableHead>
              <TableHead className='w-[120px] text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow
                key={question.id}
                onMouseEnter={() => setHoveredRow(question.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={hoveredRow === question.id ? 'bg-muted/50' : ''}
              >
                <TableCell className='font-mono text-xs'>
                  {question.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8 ring-1 ring-border'>
                      {question.user?.avatarMedia?.url && (
                        <AvatarImage
                          src={question.user.avatarMedia.url}
                          alt={`${question.user.firstName} ${question.user.lastName}`}
                        />
                      )}
                      <AvatarFallback className='text-[10px] bg-muted'>
                        {getInitials(
                          question.user?.firstName,
                          question.user?.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        {question.user?.firstName} {question.user?.lastName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {question.product?.images?.[0]?.media?.url && (
                      <div className='relative h-10 w-10 rounded overflow-hidden border bg-white shrink-0'>
                        <Image
                          src={question.product.images[0].media.url}
                          alt={question.product.name}
                          className='h-full w-full object-cover'
                        />
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <span className='text-sm font-medium line-clamp-1'>
                        {question.product?.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className='text-sm line-clamp-2 max-w-[300px]'>
                    {question.question}
                  </p>
                </TableCell>
                <TableCell>
                  {question.status === ProductQuestionStatus.ANSWERED ? (
                    <Badge
                      variant='primary-pink'
                      className='text-[10px] uppercase font-bold tracking-wider'
                    >
                      <CheckCircle className='h-3 w-3 mr-1' />
                      Đã trả lời
                    </Badge>
                  ) : (
                    <Badge
                      variant='secondary'
                      className='text-[10px] uppercase font-bold tracking-wider'
                    >
                      <Clock className='h-3 w-3 mr-1' />
                      Chờ trả lời
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-xs text-muted-foreground'>
                  {formatDate(question.createdAt)}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => onViewDetail(question)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xem chi tiết</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-primary-pink hover:bg-primary-pink/10'
                          onClick={() => onAnswer(question)}
                        >
                          <MessageSquare className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {question.status === ProductQuestionStatus.ANSWERED
                          ? 'Cập nhật câu trả lời'
                          : 'Trả lời'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-destructive hover:bg-destructive/5'
                          onClick={() => onDelete(question)}
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

function QandATableSkeleton() {
  return (
    <div className='rounded-lg border bg-card w-full overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead className='min-w-[200px]'>Người hỏi</TableHead>
            <TableHead className='min-w-[200px]'>Sản phẩm</TableHead>
            <TableHead className='min-w-[300px]'>Câu hỏi</TableHead>
            <TableHead className='w-[140px]'>Trạng thái</TableHead>
            <TableHead className='w-40'>Ngày tạo</TableHead>
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
                  <Skeleton className='h-4 w-24' />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-32' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-48' />
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
