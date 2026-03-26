'use client';

import { useState, useMemo } from 'react';

import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from '@/components/ui/tabs-underline';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/app/(main)/profile/components/empty-state';
import { QuestionCard } from './question-card';
import { useGetMyQuestionsQuery } from '@/hooks/querys/product-question.query';

import { ProductQuestionStatus } from '@/lib/types/interfaces/apis/product-question.interfaces';

// ============ Types ============
type QuestionTab = 'all' | 'pending' | 'answered';

// ============ Helper Component ============
function QuestionsSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

// ============ Main Component ============
export function QuestionsContent() {
  const [activeTab, setActiveTab] = useState<QuestionTab>('all');

  const { data, isLoading } = useGetMyQuestionsQuery();

  const questions = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  const { allQuestions, pendingQuestions, answeredQuestions } = useMemo(() => {
    return {
      allQuestions: questions,
      pendingQuestions: questions.filter(
        (q) => q.status === ProductQuestionStatus.PENDING
      ),
      answeredQuestions: questions.filter(
        (q) => q.status === ProductQuestionStatus.ANSWERED
      ),
    };
  }, [questions]);

  const allCount = allQuestions.length;
  const pendingCount = pendingQuestions.length;
  const answeredCount = answeredQuestions.length;

  if (isLoading) {
    return <QuestionsSkeleton />;
  }

  const renderTabContent = (tabQuestions: typeof questions) => {
    return tabQuestions.length > 0 ? (
      <div className="grid gap-4">
        {tabQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    ) : (
      <EmptyState
        title="Không có câu hỏi"
        description="Bạn chưa có câu hỏi nào trong mục này"
      />
    );
  };

  return (
    <div className="space-y-4">
      <TabsUnderline
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as QuestionTab)}
      >
        <TabsUnderlineList>
          <TabsUnderlineTrigger value="all">
            Tất cả
            {allCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                {allCount}
              </span>
            )}
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="pending">
            Chờ phản hồi
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                {pendingCount}
              </span>
            )}
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="answered">
            Đã trả lời
            {answeredCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                {answeredCount}
              </span>
            )}
          </TabsUnderlineTrigger>
        </TabsUnderlineList>

        <TabsUnderlineContent value="all">
          {renderTabContent(allQuestions)}
        </TabsUnderlineContent>

        <TabsUnderlineContent value="pending">
          {renderTabContent(pendingQuestions)}
        </TabsUnderlineContent>

        <TabsUnderlineContent value="answered">
          {renderTabContent(answeredQuestions)}
        </TabsUnderlineContent>
      </TabsUnderline>
    </div>
  );
}
