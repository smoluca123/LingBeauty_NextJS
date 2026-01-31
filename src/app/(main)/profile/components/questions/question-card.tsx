'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, CheckCircle2, Clock, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  QUESTION_STATUS_LABELS,
  QUESTION_STATUS_COLORS,
  formatQuestionDate,
  type Question,
} from '../../questions/_data/mock-questions';

// ============ Question Card Component ============
interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(question.status === 'answered');

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        {/* Product Info */}
        <div className="flex gap-3 mb-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={question.productImage}
              alt={question.productName}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm line-clamp-2 text-foreground">
              {question.productName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={`${QUESTION_STATUS_COLORS[question.status]} border-0 text-xs`}
              >
                {question.status === 'answered' ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {QUESTION_STATUS_LABELS[question.status]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatQuestionDate(question.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-pink/10 shrink-0">
              <MessageCircle className="h-4 w-4 text-primary-pink" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Câu hỏi của bạn</p>
              <p className="text-sm text-foreground">{question.question}</p>
            </div>
          </div>

          {/* Answer */}
          {question.answer && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-sm font-normal text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Xem câu trả lời
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 ml-11 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-foreground mb-2">
                    {question.answer}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Trả lời bởi: {question.answeredBy}</span>
                    {question.answeredAt && (
                      <span>{formatQuestionDate(question.answeredAt)}</span>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Pending Status Message */}
          {question.status === 'pending' && (
            <div className="ml-11 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
              Câu hỏi của bạn đang được xem xét. Chúng tôi sẽ phản hồi sớm nhất
              có thể.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
