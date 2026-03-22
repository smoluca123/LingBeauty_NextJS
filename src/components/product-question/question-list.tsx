'use client';

import { memo } from 'react';
import { MessageCircleQuestion, Smile } from 'lucide-react';
import { QuestionItem } from './question-item';
import { QuestionListSkeleton } from './question-list-skeleton';
import { IProductQuestion } from '@/lib/types/interfaces/apis/product-question.interfaces';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface QuestionListProps {
  questions: IProductQuestion[];
  productId: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onAskQuestion: () => void;
  isAuthenticated: boolean;
}

// Memoize to prevent re-renders when parent state changes (rerender-memo)
export const QuestionList = memo(function QuestionList({
  questions,
  productId,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onAskQuestion,
  isAuthenticated,
}: QuestionListProps) {
  if (isLoading) {
    return <QuestionListSkeleton />;
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/30 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-pink/10">
          <Smile className="h-6 w-6 text-primary-pink" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Chưa có câu hỏi nào
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Bạn có thắc mắc về sản phẩm? Hãy đặt câu hỏi, chúng tôi sẽ phản hồi
            sớm nhất có thể.
          </p>
        </div>
        <button
          onClick={onAskQuestion}
          className="rounded-full border border-primary-pink px-6 py-2 text-sm font-semibold text-primary-pink transition-colors hover:bg-primary-pink/10"
        >
          Đặt câu hỏi
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            productId={productId}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
});
