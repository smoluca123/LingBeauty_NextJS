/**
 * Product Form Types
 * Types for product-related forms
 */

export interface ProductFormValues {
  name: string
  slug?: string
  sku?: string
  shortDesc?: string
  categoryId: string
  brandId: string
  basePrice: number
  comparePrice?: number
  stock?: number
  lowStockThreshold?: number
  isActive?: boolean
  isFeatured?: boolean
}

export interface ProductQuestionFormValues {
  question: string
}

export interface ProductAnswerFormValues {
  answer: string
  answeredBy?: string
}
