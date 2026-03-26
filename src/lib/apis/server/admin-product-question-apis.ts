'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IProductQuestionWithProduct,
  IProductQuestionFilters,
  IAnswerQuestionPayload,
} from '@/lib/types/interfaces/apis/product-question.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Get All Questions (Admin) ============
export const getAllAdminQuestionsAPI = async (
  params: IProductQuestionFilters = {},
) =>
  kyInstance
    .get('product-question', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        productId: params.productId,
        userId: params.userId,
        status: params.status,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IProductQuestionWithProduct>>();

// ============ Get Question By ID (Admin) ============
export const getAdminQuestionByIdAPI = async (questionId: string) =>
  kyInstance
    .get(`product-question/${questionId}`)
    .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();

// ============ Answer Question (Admin) ============
export const answerQuestionAPI = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) =>
  kyInstance
    .patch(`product-question/${questionId}/answer`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();

// ============ Update Answer (Admin) ============
export const updateAnswerAPI = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) =>
  kyInstance
    .patch(`product-question/${questionId}/update-answer`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();

// ============ Delete Answer (Admin) ============
export const deleteAnswerAPI = async (questionId: string) =>
  kyInstance
    .delete(`product-question/${questionId}/answer`)
    .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();

// ============ Delete Question By Admin ============
export const deleteQuestionByAdminAPI = async (questionId: string) =>
  kyInstance
    .delete(`product-question/${questionId}/admin`)
    .json<IApiResponseWrapperType<{ message: string }>>();
