'use client';

import { useState } from 'react';
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from '@/components/ui/tabs-underline';
import { EmptyState } from '../empty-state';
import {
  type Question,
  MOCK_QUESTIONS,
  getQuestionsByStatus,
} from '../../questions/_data/mock-questions';
import { QuestionCard } from './question-card';

// ============ Types ============
type QuestionTab = 'all' | 'pending' | 'answered';

// ============ Helper Component ============
function QuestionsTabContent({ questions }: { questions: Question[] }) {
  return questions.length > 0 ? (
    <div className="grid gap-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  ) : (
    <EmptyState
      title="Không có câu hỏi"
      description="Bạn chưa có câu hỏi nào trong mục này"
    />
  );
}

// ============ Main Component ============
export function QuestionsContent() {
  const [activeTab, setActiveTab] = useState<QuestionTab>('all');

  const allCount = MOCK_QUESTIONS.length;
  const pendingCount = getQuestionsByStatus('pending').length;
  const answeredCount = getQuestionsByStatus('answered').length;

  const allQuestions = getQuestionsByStatus('all');
  const pendingQuestions = getQuestionsByStatus('pending');
  const answeredQuestions = getQuestionsByStatus('answered');

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
          <QuestionsTabContent questions={allQuestions} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="pending">
          <QuestionsTabContent questions={pendingQuestions} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="answered">
          <QuestionsTabContent questions={answeredQuestions} />
        </TabsUnderlineContent>
      </TabsUnderline>
    </div>
  );
}
