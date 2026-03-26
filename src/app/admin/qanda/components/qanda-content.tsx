'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  IProductQuestionWithProduct,
  IProductQuestionFilters,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces';
import {
  QandAFilters,
  QandATable,
  QandAStats,
  AnswerDialog,
  QuestionDetailDialog,
  DeleteQuestionDialog,
} from './';

import type { AnswerFormValues } from '../schemas/answer-form.schema';
import {
  useInfiniteAdminQuestions,
  useAnswerQuestionMutation,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
  useDeleteQuestionByAdminMutation,
} from '@/hooks/querys/admin-product-question.query';
import { useAuthUser } from '@/hooks/use-auth';

// ── Main Component ─────────────────────────────────────────────────────────

export function QandAContent() {
  // ── Get current user ─────────────────────────────────────────────────────
  const currentUser = useAuthUser();

  // ── Filter states ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortValue, setSortValue] = useState('default');

  // ── Dialog states ────────────────────────────────────────────────────────
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<IProductQuestionWithProduct | null>(null);

  // ── Mutations ────────────────────────────────────────────────────────────
  const answerMutation = useAnswerQuestionMutation();
  const updateAnswerMutation = useUpdateAnswerMutation();
  const deleteAnswerMutation = useDeleteAnswerMutation();
  const deleteMutation = useDeleteQuestionByAdminMutation();

  // ── Parse sort value ─────────────────────────────────────────────────────
  const parsedSort = sortValue !== 'default' ? sortValue.split(':') : [];
  const sortBy =
    parsedSort.length === 2
      ? (parsedSort[0] as IProductQuestionFilters['sortBy'])
      : undefined;
  const order =
    parsedSort.length === 2
      ? (parsedSort[1] as IProductQuestionFilters['order'])
      : undefined;

  // ── Infinite Query ───────────────────────────────────────────────────────
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteAdminQuestions({
      status:
        statusFilter !== 'all'
          ? (statusFilter as ProductQuestionStatus)
          : undefined,
      sortBy,
      order,
      pageSize: 12,
    });

  // Flatten all pages into single array
  const questions = data?.pages.flatMap((page) => page.data.items) ?? [];
  const totalCount = data?.pages[0]?.data.totalCount ?? 0;

  // Calculate stats from data
  const stats = {
    totalQuestions: totalCount,
    answeredQuestions: questions.filter(
      (q) => q.status === ProductQuestionStatus.ANSWERED,
    ).length,
    pendingQuestions: questions.filter(
      (q) => q.status === ProductQuestionStatus.PENDING,
    ).length,
    answerRate:
      totalCount > 0
        ? Math.round(
            (questions.filter(
              (q) => q.status === ProductQuestionStatus.ANSWERED,
            ).length /
              totalCount) *
              100,
          )
        : 0,
  };

  // ── Check if any filter is active ────────────────────────────────────────
  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'all' || sortValue !== 'default';

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortValue('default');
  };

  const handleViewDetail = (question: IProductQuestionWithProduct) => {
    setSelectedQuestion(question);
    setDetailDialogOpen(true);
  };

  const handleAnswer = (question: IProductQuestionWithProduct) => {
    setSelectedQuestion(question);
    setAnswerDialogOpen(true);
  };

  const handleDelete = (question: IProductQuestionWithProduct) => {
    setSelectedQuestion(question);
    setDeleteDialogOpen(true);
  };

  const handleAnswerSubmit = async (data: AnswerFormValues) => {
    if (!selectedQuestion || !currentUser) return;

    const isUpdate = selectedQuestion.status === ProductQuestionStatus.ANSWERED;

    // Add answeredBy to payload
    const payload = {
      ...data,
      answeredBy: currentUser.id,
    };

    if (isUpdate) {
      await updateAnswerMutation.mutateAsync({
        questionId: selectedQuestion.id,
        data: payload,
      });
    } else {
      await answerMutation.mutateAsync({
        questionId: selectedQuestion.id,
        data: payload,
      });
    }

    setAnswerDialogOpen(false);
    setSelectedQuestion(null);
  };

  const handleDeleteAnswer = async (questionId: string) => {
    await deleteAnswerMutation.mutateAsync(questionId);
    setAnswerDialogOpen(false);
    setSelectedQuestion(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;

    await deleteMutation.mutateAsync(selectedQuestion.id);

    setDeleteDialogOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Quản lý câu hỏi sản phẩm
          </h1>
          <p className='text-muted-foreground'>
            Quản lý và trả lời câu hỏi từ khách hàng về sản phẩm.
          </p>
        </div>
      </div>

      {/* Stats */}
      <QandAStats stats={stats} isLoading={isLoading} />

      {/* Filters */}
      <QandAFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Results Count */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold'>Danh sách câu hỏi</h2>
          {!isLoading && (
            <span className='text-sm text-muted-foreground'>
              ({totalCount} câu hỏi)
            </span>
          )}
        </div>
        {isFetchingNextPage && (
          <span className='text-sm text-muted-foreground flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Đang tải thêm...
          </span>
        )}
      </div>

      {/* Table */}
      <QandATable
        questions={questions}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
        onAnswer={handleAnswer}
        onDelete={handleDelete}
      />

      {/* Load More */}
      {hasNextPage && (
        <div className='py-4 text-center'>
          <Button
            variant='outline'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
                Đang tải...
              </>
            ) : (
              'Tải thêm'
            )}
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <QuestionDetailDialog
        question={selectedQuestion}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <AnswerDialog
        question={selectedQuestion}
        open={answerDialogOpen}
        onOpenChange={setAnswerDialogOpen}
        onSubmit={handleAnswerSubmit}
        onDeleteAnswer={handleDeleteAnswer}
        isPending={answerMutation.isPending || updateAnswerMutation.isPending}
        isDeleting={deleteAnswerMutation.isPending}
      />

      <DeleteQuestionDialog
        question={selectedQuestion}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
