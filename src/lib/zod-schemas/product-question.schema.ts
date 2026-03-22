import { z } from "zod";

export const createQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập câu hỏi")
    .max(500, "Câu hỏi không được vượt quá 500 ký tự"),
});

export const updateQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập câu hỏi")
    .max(500, "Câu hỏi không được vượt quá 500 ký tự"),
});

export const answerQuestionSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập câu trả lời")
    .max(1000, "Câu trả lời không được vượt quá 1000 ký tự"),
  answeredBy: z.string().uuid("ID admin không hợp lệ").optional(),
});

export type CreateQuestionValues = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionValues = z.infer<typeof updateQuestionSchema>;
export type AnswerQuestionValues = z.infer<typeof answerQuestionSchema>;
