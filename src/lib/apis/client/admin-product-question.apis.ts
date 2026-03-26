import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IProductQuestionWithProduct,
  IAnswerQuestionPayload,
  IProductQuestionFilters,
} from '@/lib/types/interfaces/apis/product-question.interfaces';
import { HTTPError } from 'ky';

/**
 * Get all questions (Admin)
 */
export const getAllAdminQuestionsAPI = async (
  params: IProductQuestionFilters = {},
) => {
  try {
    const searchParams: Record<string, string | number> = {};

    if (params.page) searchParams.page = params.page;
    if (params.limit) searchParams.limit = params.limit;
    if (params.productId) searchParams.productId = params.productId;
    if (params.userId) searchParams.userId = params.userId;
    if (params.status) searchParams.status = params.status;
    if (params.sortBy) searchParams.sortBy = params.sortBy;
    if (params.order) searchParams.order = params.order;

    const response = await kyNextInstance
      .get('admin/product-question', { searchParams })
      .json<IApiPaginationResponseWrapperType<IProductQuestionWithProduct>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch questions');
    }
    throw error;
  }
};

/**
 * Get question by ID (Admin)
 */
export const getAdminQuestionByIdAPI = async (questionId: string) => {
  try {
    const response = await kyNextInstance
      .get(`admin/product-question/${questionId}`)
      .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch question');
    }
    throw error;
  }
};

/**
 * Answer a question (Admin)
 */
export const answerQuestionAPI = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) => {
  try {
    const response = await kyNextInstance
      .patch(`admin/product-question/${questionId}/answer`, { json: data })
      .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to answer question');
    }
    throw error;
  }
};

/**
 * Update answer (Admin)
 */
export const updateAnswerAPI = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) => {
  try {
    const response = await kyNextInstance
      .patch(`admin/product-question/${questionId}/update-answer`, {
        json: data,
      })
      .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update answer');
    }
    throw error;
  }
};

/**
 * Delete answer (Admin)
 */
export const deleteAnswerAPI = async (questionId: string) => {
  try {
    const response = await kyNextInstance
      .delete(`admin/product-question/${questionId}/answer`)
      .json<IApiResponseWrapperType<IProductQuestionWithProduct>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete answer');
    }
    throw error;
  }
};

/**
 * Delete question by admin
 */
export const deleteQuestionByAdminAPI = async (questionId: string) => {
  try {
    const response = await kyNextInstance
      .delete(`admin/product-question/${questionId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete question');
    }
    throw error;
  }
};
