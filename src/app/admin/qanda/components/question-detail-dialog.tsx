'use client'

import Image from 'next/image'
import {
  MessageSquare,
  Package,
  User,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  IProductQuestionWithProduct,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces'

interface QuestionDetailDialogProps {
  question: IProductQuestionWithProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuestionDetailDialog({
  question,
  open,
  onOpenChange,
}: QuestionDetailDialogProps) {
  if (!question) return null

  const product = question.product

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chi tiết câu hỏi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {question.status === ProductQuestionStatus.ANSWERED ? (
              <Badge variant="primary-pink">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đã trả lời
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Chờ trả lời
              </Badge>
            )}
            {question.isPublic && <Badge variant="outline">Công khai</Badge>}
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Người hỏi
            </div>
            <div className="pl-6">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                <Avatar className="h-12 w-12 ring-2 ring-background">
                  <AvatarFallback className="text-sm font-semibold">
                    {getInitials(
                      question.user?.firstName,
                      question.user?.lastName,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base">
                    {question.user?.firstName} {question.user?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <div className="font-mono text-xs">
                      ID: {question.userId.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-muted-foreground" />
              Sản phẩm
            </div>
            {product ? (
              <div className="pl-6">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                  {product.images?.[0]?.media?.url ? (
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
                      <Image
                        src={product.images[0].media.url}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <div className="font-semibold text-base leading-tight mb-1">
                        {product.name}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded border">
                        {product.slug}
                      </span>
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded border">
                        ID: {product.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pl-6 text-sm text-muted-foreground">
                Không tìm thấy thông tin sản phẩm
              </div>
            )}
          </div>

          <Separator />

          {/* Question */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Câu hỏi
            </div>
            <div className="pl-6">
              <div className="text-sm leading-relaxed p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                {question.question}
              </div>
            </div>
          </div>

          {/* Answer */}
          {question.answer && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-primary-pink" />
                  Câu trả lời
                </div>
                <div className="pl-6 space-y-3">
                  <div className="text-sm leading-relaxed bg-primary-pink/10 border border-primary-pink/20 p-4 rounded-lg">
                    {question.answer}
                  </div>
                  {question.answeredByUser && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(
                            question.answeredByUser.firstName,
                            question.answeredByUser.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {question.answeredByUser.firstName}{' '}
                          {question.answeredByUser.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-primary-pink" />
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
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Ngày tạo: {formatDate(question.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Cập nhật: {formatDate(question.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
