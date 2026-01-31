'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '../empty-state';
import {
  MOCK_QUESTIONS,
  getQuestionsByStatus,
  type QuestionStatus,
} from '../../questions/_data/mock-questions';
import { QuestionCard } from './question-card';

// ============ Types ============
type QuestionTab = 'all' | 'pending' | 'answered';

interface TabItem {
  value: QuestionTab;
  label: string;
  count?: number;
}

// ============ Main Component ============
export function QuestionsContent() {
  const [activeTab, setActiveTab] = useState<QuestionTab>('all');

  const allCount = MOCK_QUESTIONS.length;
  const pendingCount = getQuestionsByStatus('pending').length;
  const answeredCount = getQuestionsByStatus('answered').length;

  const QUESTION_TABS: TabItem[] = [
    { value: 'all', label: 'Tất cả', count: allCount },
    { value: 'pending', label: 'Chờ phản hồi', count: pendingCount },
    { value: 'answered', label: 'Đã trả lời', count: answeredCount },
  ];

  const filteredQuestions = getQuestionsByStatus(
    activeTab === 'all' ? 'all' : (activeTab as QuestionStatus)
  );

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as QuestionTab)}
      >
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
          {QUESTION_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-10 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:border-primary-pink data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        {QUESTION_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredQuestions.length > 0 ? (
              <div className="grid gap-4">
                {filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không có câu hỏi"
                description="Bạn chưa có câu hỏi nào trong mục này"
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
