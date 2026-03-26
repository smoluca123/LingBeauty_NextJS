import { getAllQuestionsAPI } from '@/lib/apis/server/product-question-apis'
import { createQuestionAction } from '@/lib/apis/server/actions/product-question.actions'
import { proxyRoute } from '@/lib/proxy-route'
import type {
  IProductQuestionFilters,
  ICreateQuestionPayload,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces'

// GET /api/product-question - Get all questions (Admin)
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const params: IProductQuestionFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    productId: searchParams.get('productId') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
    status:
      (searchParams.get('status') as ProductQuestionStatus | null) ?? undefined,
    sortBy:
      (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | null) ??
      undefined,
    order: (searchParams.get('order') as 'asc' | 'desc' | null) ?? undefined,
  }

  return proxyRoute(() => getAllQuestionsAPI(params))
}

// POST /api/product-question - Create new question
export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateQuestionPayload
  return proxyRoute(() => createQuestionAction(body))
}
