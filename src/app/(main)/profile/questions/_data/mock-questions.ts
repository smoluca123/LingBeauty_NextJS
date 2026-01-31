// Mock data for Questions page
export type QuestionStatus = 'pending' | 'answered';

export interface Question {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  question: string;
  answer?: string;
  status: QuestionStatus;
  createdAt: string;
  answeredAt?: string;
  answeredBy?: string;
}

export const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    productId: 'p1',
    productName: 'Son YSL Rouge Pur Couture',
    productImage: '/images/products/ysl-lipstick.jpg',
    question:
      'Màu #13 Le Orange có phù hợp với da ngăm đen không ạ? Và son có khô môi không?',
    answer:
      'Chào bạn, Màu #13 Le Orange là tông cam tươi sáng, rất phù hợp với da ngăm vì giúp da trông sáng hơn. Son YSL Rouge Pur Couture có công thức dưỡng ẩm nên không gây khô môi nhé!',
    status: 'answered',
    createdAt: '2026-01-20T10:30:00',
    answeredAt: '2026-01-21T09:15:00',
    answeredBy: 'Beauty Advisor Linh',
  },
  {
    id: '2',
    productId: 'p2',
    productName: 'Kem Dưỡng La Mer Moisturizing Cream',
    productImage: '/images/products/la-mer-cream.jpg',
    question:
      'Sản phẩm này có phù hợp với da dầu không? Và dùng được vào ban ngày không ạ?',
    answer:
      'Dạ chào bạn, La Mer Moisturizing Cream có kết cấu rich cream, phù hợp hơn với da khô và da thường. Nếu da dầu, bạn có thể cân nhắc La Mer Moisturizing Soft Cream hoặc The Moisturizing Gel Cream. Sản phẩm có thể dùng cả ngày và đêm nhé!',
    status: 'answered',
    createdAt: '2026-01-22T14:20:00',
    answeredAt: '2026-01-22T16:45:00',
    answeredBy: 'Beauty Advisor Mai',
  },
  {
    id: '3',
    productId: 'p3',
    productName: 'Serum SK-II Facial Treatment Essence',
    productImage: '/images/products/sk2-essence.jpg',
    question:
      'Cho mình hỏi sản phẩm này dùng được cho da nhạy cảm không? Và nên dùng trước hay sau toner ạ?',
    status: 'pending',
    createdAt: '2026-01-28T11:00:00',
  },
  {
    id: '4',
    productId: 'p4',
    productName: 'Nước Hoa Dior Sauvage EDP',
    productImage: '/images/products/dior-sauvage.jpg',
    question:
      'Mùi hương này lưu được bao lâu ạ? Có phù hợp dùng đi làm văn phòng không?',
    answer:
      'Chào bạn! Dior Sauvage EDP có độ lưu hương rất tốt, khoảng 8-10 tiếng. Mùi hương nam tính nhưng không quá nặng, hoàn toàn phù hợp cho môi trường văn phòng nhé!',
    status: 'answered',
    createdAt: '2026-01-25T08:30:00',
    answeredAt: '2026-01-25T10:00:00',
    answeredBy: 'Fragrance Expert Huy',
  },
  {
    id: '5',
    productId: 'p5',
    productName: 'Phấn Nền Charlotte Tilbury Airbrush',
    productImage: '/images/products/ct-powder.jpg',
    question:
      'Mình da tone warm, nên chọn Medium 2 hay Medium 3 ạ? Phấn có kiểm soát dầu tốt không?',
    status: 'pending',
    createdAt: '2026-01-29T16:45:00',
  },
];

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  pending: 'Chờ phản hồi',
  answered: 'Đã trả lời',
};

export const QUESTION_STATUS_COLORS: Record<QuestionStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  answered: 'bg-green-100 text-green-700',
};

export function getQuestionsByStatus(status: QuestionStatus | 'all'): Question[] {
  if (status === 'all') return MOCK_QUESTIONS;
  return MOCK_QUESTIONS.filter((q) => q.status === status);
}

export function formatQuestionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
