'use client';

import { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionList } from '@/components/product-question/question-list';
import { QuestionFormDialog } from '@/components/product-question/question-form-dialog';
import { useGetPublicProductQuestionsQuery } from '@/hooks/querys/product-question.query';
import { useAuthStore } from '@/stores/auth.store';
import { ProductQuestionStatus } from '@/lib/types/interfaces/apis/product-question.interfaces';

interface ProductDetailQnaTabProps {
  productId: string;
  productName: string;
}

export function ProductDetailQnaTab({
  productId,
  productName,
}: ProductDetailQnaTabProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ProductQuestionStatus | undefined>();
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const { data: questionsData, isLoading } =
    useGetPublicProductQuestionsQuery(productId, {
      page,
      limit: 10,
      status: statusFilter,
      sortBy: 'createdAt',
      order: 'desc',
    });

  const questions = questionsData?.data?.items || [];
  const totalCount = questionsData?.data?.totalCount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="h-5 w-5 text-primary-pink" />
          <div>
            <h3 className="font-medium">Hỏi & Đáp</h3>
            <p className="text-sm text-muted-foreground">
              {totalCount > 0
                ? `${totalCount} câu hỏi`
                : 'Chưa có câu hỏi nào'}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAskDialogOpen(true)}
          className="bg-primary-pink hover:bg-primary-pink/90"
        >
          <MessageCircleQuestion className="h-4 w-4 mr-2" />
          Đặt câu hỏi
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setStatusFilter(undefined)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === undefined
              ? 'bg-primary-pink text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setStatusFilter(ProductQuestionStatus.ANSWERED)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === ProductQuestionStatus.ANSWERED
              ? 'bg-primary-pink text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Đã trả lời
        </button>
        <button
          onClick={() => setStatusFilter(ProductQuestionStatus.PENDING)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === ProductQuestionStatus.PENDING
              ? 'bg-primary-pink text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Chờ phản hồi
        </button>
      </div>

      {/* Questions List */}
      <QuestionList
        questions={questions}
        productId={productId}
        totalCount={totalCount}
        currentPage={page}
        pageSize={10}
        isLoading={isLoading}
        onPageChange={setPage}
        onAskQuestion={() => setIsAskDialogOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      {/* Ask Question Dialog */}
      <QuestionFormDialog
        productId={productId}
        productName={productName}
        isOpen={isAskDialogOpen}
        onClose={() => setIsAskDialogOpen(false)}
      />
    </div>
  );
}
