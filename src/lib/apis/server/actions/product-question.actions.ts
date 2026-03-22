"use server";

import { kyInstance } from "@/lib/kyInstance/ky";
import type { IApiResponseWrapperType } from "@/lib/types/interfaces/apis/api.interfaces";
import type {
  IProductQuestion,
  ICreateQuestionPayload,
  IAnswerQuestionPayload,
} from "@/lib/types/interfaces/apis/product-question.interfaces";

// ============ Create Question (User - yêu cầu auth JWT) ============
export const createQuestionAction = async (data: ICreateQuestionPayload) =>
  kyInstance
    .post("product-question", { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>();

// ============ Delete Question (User - yêu cầu auth JWT) ============
export const deleteQuestionAction = async (questionId: string) =>
  kyInstance
    .delete(`product-question/${questionId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

// ============ Update Question (User - yêu cầu auth JWT) ============
export const updateQuestionAction = async (
  questionId: string,
  data: { question: string },
) =>
  kyInstance
    .patch(`product-question/${questionId}`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>();

// ============ Answer Question (Admin - yêu cầu auth JWT) ============
export const answerQuestionAction = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) =>
  kyInstance
    .patch(`product-question/${questionId}/answer`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>();

// ============ Update Answer (Admin - yêu cầu auth JWT) ============
export const updateAnswerAction = async (
  questionId: string,
  data: IAnswerQuestionPayload,
) =>
  kyInstance
    .patch(`product-question/${questionId}/update-answer`, { json: data })
    .json<IApiResponseWrapperType<IProductQuestion>>();

// ============ Delete Question By Admin ============
export const deleteQuestionByAdminAction = async (questionId: string) =>
  kyInstance
    .delete(`product-question/${questionId}/admin`)
    .json<IApiResponseWrapperType<{ message: string }>>();
