'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MessageCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  IProductQuestionWithProduct,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces'
import { useDeleteQuestionMutation } from '@/hooks/mutations/product-question.mutation'
import { EditQuestionDialog } from '@/components/product-question/edit-question-dialog'

// ============ Constants ============
const QUESTION_STATUS_LABELS: Record<ProductQuestionStatus, string> = {
  [ProductQuestionStatus.PENDING]: 'Chờ phản hồi',
  [ProductQuestionStatus.ANSWERED]: 'Đã trả lời',
}

const QUESTION_STATUS_COLORS: Record<ProductQuestionStatus, string> = {
  [ProductQuestionStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [ProductQuestionStatus.ANSWERED]: 'bg-green-100 text-green-700',
}

// ============ Question Card Component ============
interface QuestionCardProps {
  question: IProductQuestionWithProduct
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(
    question.status === ProductQuestionStatus.ANSWERED,
  )
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { mutate: deleteQuestion, isPending: isDeleting } =
    useDeleteQuestionMutation(question.id, question.productId)

  const handleDelete = () => {
    deleteQuestion()
    setShowDeleteDialog(false)
  }

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    })
  }

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          {/* Product Info */}
          <div className="flex gap-3 mb-4">
            <Link
              href={`/products/${question.product.slug}`}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted hover:opacity-80 transition-opacity"
            >
              <Image
                src={
                  question.product.images.find((img) => img.isPrimary)?.media
                    .url || '/placeholder.png'
                }
                alt={question.product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${question.product.slug}`}
                className="font-medium text-sm line-clamp-2 text-foreground hover:text-primary-pink transition-colors"
              >
                {question.product.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={`${QUESTION_STATUS_COLORS[question.status]} border-0 text-xs`}
                >
                  {question.status === ProductQuestionStatus.ANSWERED ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {QUESTION_STATUS_LABELS[question.status]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(question.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {question.status === ProductQuestionStatus.PENDING && (
                <EditQuestionDialog
                  questionId={question.id}
                  productId={question.productId}
                  currentQuestion={question.question}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-pink/10 shrink-0">
                <MessageCircle className="h-4 w-4 text-primary-pink" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Câu hỏi của bạn
                </p>
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
                      <span>
                        Trả lời bởi:{' '}
                        {`${question.answeredByUser?.firstName} ${question.answeredByUser?.lastName}` ||
                          'Admin'}
                      </span>
                      {question.updatedAt && (
                        <span>{formatDate(question.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Pending Status Message */}
            {question.status === ProductQuestionStatus.PENDING && (
              <div className="ml-11 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                Câu hỏi của bạn đang được xem xét. Chúng tôi sẽ phản hồi sớm
                nhất có thể.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
