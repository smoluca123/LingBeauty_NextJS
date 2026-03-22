'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IProductQuestion,
  IProductQuestionWithProduct,
  IProductQuestionFilters,
} from '@/lib/types/interfaces/apis/product-question.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Get All Questions (Admin - yêu cầu auth JWT) ============
export const getAllQuestionsAPI = async (
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
    .json<IApiPaginationResponseWrapperType<IProductQuestion>>();

// ============ Get My Questions (User - yêu cầu auth JWT) ============
export const getMyQuestionsAPI = async (
  params: IProductQuestionFilters = {},
) =>
  kyInstance
    .get('product-question/my-questions', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        status: params.status,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IProductQuestion>>();

// ============ Get Question By ID ============
export const getQuestionByIdAPI = async (questionId: string) =>
  kyInstance
    .get(`product-question/${questionId}`)
    .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();

// ============ Get Public Product Questions (No auth) ============
export const getPublicProductQuestionsAPI = async (
  productId: string,
  params: IProductQuestionFilters = {},
) =>
  kyInstance
    .get(`product-question/public/product/${productId}`, {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        status: params.status,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IProductQuestion>>();
