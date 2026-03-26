import { IProductImageDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'

export enum ProductQuestionStatus {
  PENDING = 'PENDING',
  ANSWERED = 'ANSWERED',
}

export interface IUserBasic {
  id: string
  firstName: string
  lastName: string
  fullName?: string
  avatarMedia?: {
    id: string
    url: string
  }
}

export interface IProductBasic {
  id: string
  name: string
  slug: string
  images: IProductImageDataType[]
  description?: string
  price?: number
  sku?: string
  stock?: number
  brand?: {
    id: string
    name: string
  }
}

export interface IProductQuestion {
  id: string
  productId: string
  userId: string
  question: string
  answer: string | null
  answeredBy: string | null
  status: ProductQuestionStatus
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: IUserDataType
  answeredByUser: IUserBasic | null
}

export interface IProductQuestionWithProduct extends IProductQuestion {
  product: IProductBasic
}

export interface ICreateQuestionPayload {
  productId: string
  question: string
}

export interface IAnswerQuestionPayload {
  answer: string
  answeredBy?: string
}

export interface IProductQuestionFilters {
  page?: number
  limit?: number
  productId?: string
  userId?: string
  status?: ProductQuestionStatus
  sortBy?: 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
}
