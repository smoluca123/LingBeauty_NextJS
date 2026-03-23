import { z } from 'zod';

export const answerFormSchema = z.object({
  answer: z
    .string()
    .min(1, 'Câu trả lời không được để trống')
    .min(10, 'Câu trả lời phải có ít nhất 10 ký tự')
    .max(1000, 'Câu trả lời không được vượt quá 1000 ký tự'),
});

export type AnswerFormValues = z.infer<typeof answerFormSchema>;
