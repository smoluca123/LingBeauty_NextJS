import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IProductQuestion,
  IProductQuestionWithProduct,
  ICreateQuestionPayload,
  IProductQuestionFilters,
} from '@/lib/types/interfaces/apis/product-question.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Fetch public questions for a product (client-side)
 * Calls Next.js API route -> Backend API
 */
export const getPublicProductQuestionsAPI = async (
  productId: string,
  params: Omit<IProductQuestionFilters, 'productId'> = {},
) => {
  try {
    const searchParams: Record<string, string | number> = {}

    if (params.page) searchParams.page = params.page
    if (params.limit) searchParams.limit = params.limit
    if (params.status) searchParams.status = params.status
    if (params.sortBy) searchParams.sortBy = params.sortBy
    if (params.order) searchParams.order = params.order

    const response = await kyNextInstance
      .get(`product-question/public/product/${productId}`, { searchParams })
      .json<IApiPaginationResponseWrapperType<IProductQuestion>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch questions'),
    )
  }
}

/**
 * Fetch user's own questions (client-side)
 * Calls Next.js API route -> Backend API
 */
export const getMyQuestionsAPI = async (
  params: IProductQuestionFilters = {},
) => {
  try {
    const searchParams: Record<string, string | number> = {}

    if (params.page) searchParams.page = params.page
    if (params.limit) searchParams.limit = params.limit
    if (params.status) searchParams.status = params.status
    if (params.sortBy) searchParams.sortBy = params.sortBy
    if (params.order) searchParams.order = params.order

    const response = await kyNextInstance
      .get('product-question/my-questions', { searchParams })
      .json<IApiPaginationResponseWrapperType<IProductQuestionWithProduct>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch my questions'),
    )
  }
}

/**
 * Create a new question
 * Calls Next.js API route (/api/product-question) which uses server action
 */
export const createQuestionAPI = async (data: ICreateQuestionPayload) => {
  try {
    const response = await kyNextInstance
      .post('product-question', { json: data })
      .json<IApiResponseWrapperType<IProductQuestion>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create question'),
    )
  }
}

/**
 * Delete a question
 * Calls Next.js API route (/api/product-question/:questionId) which uses server action
 */
export const deleteQuestionAPI = async (questionId: string) => {
  try {
    const response = await kyNextInstance
      .delete(`product-question/${questionId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete question'),
    )
  }
}

/**
 * Update a question
 * Calls Next.js API route (/api/product-question/:questionId) which uses server action
 */
export const updateQuestionAPI = async (
  questionId: string,
  data: { question: string },
) => {
  try {
    const response = await kyNextInstance
      .patch(`product-question/${questionId}`, { json: data })
      .json<IApiResponseWrapperType<IProductQuestion>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update question'),
    )
  }
}
