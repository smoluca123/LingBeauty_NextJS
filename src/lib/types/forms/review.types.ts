/**
 * Review Form Types
 * Types for product review forms
 */

export interface ReviewFormValues {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: File[];
}
