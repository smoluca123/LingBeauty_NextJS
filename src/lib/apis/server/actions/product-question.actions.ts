'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IProductQuestion,
  ICreateQuestionPayload,
  IAnswerQuestionPayload,
} from '@/lib/types/interfaces/apis/product-question.interfaces'

/**
 * Create question (User - requires JWT auth)
 * @param data - Question data to create
 * @returns Created question data
 * @throws Error with backend message if request fails
 */
export const createQuestionAction = async (data: ICreateQuestionPayload) =>
  kyInstance
    .post('product-question', { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>()

/**
 * Delete question (User - requires JWT auth)
 * @param questionId - Question ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteQuestionAction = async (questionId: string) =>
  kyInstance
    .delete(`product-question/${questionId}`)
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Update question (User - requires JWT auth)
 * @param questionId - Question ID to update
 * @param data - Question data to update
 * @returns Updated question data
 * @throws Error with backend message if request fails
 */
export const updateQuestionAction = async (
  questionId: string,
  data: { question: string },
) =>
  kyInstance
    .patch(`product-question/${questionId}`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>()

/**
 * Answer question (Admin - requires JWT auth)
 * @param questionId - Question ID to answer
 * @param data - Answer data
 * @returns Updated question with answer
 * @throws Error with backend message if request fails
 */
export const answerQuestionAction = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) =>
  kyInstance
    .patch(`product-question/${questionId}/answer`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>()

/**
 * Update answer (Admin - requires JWT auth)
 * @param questionId - Question ID to update answer for
 * @param data - Updated answer data
 * @returns Updated question with new answer
 * @throws Error with backend message if request fails
 */
export const updateAnswerAction = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) =>
  kyInstance
    .patch(`product-question/${questionId}/update-answer`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>()

/**
 * Delete question by admin (Admin - requires JWT auth)
 * @param questionId - Question ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteQuestionByAdminAction = async (questionId: string) =>
  kyInstance
    .delete(`product-question/${questionId}/admin`)
    .json<IApiResponseWrapperType<{ message: string }>>()
