import { IMediaDataType } from '@/lib/types/interfaces/apis/image.interfaces'
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'

export interface IReviewImageDataType {
  id: string
  reviewId: string
  mediaId: string
  alt: string | null
  createdAt: Date
  media: IMediaDataType
}

export interface IReviewReplyDataType {
  id: string
  reviewId: string
  userId: string
  content: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  user: IUserDataType
}

export interface IReviewDataType {
  id: string
  productId: string
  userId: string
  rating: number
  title: string | null
  comment: string | null
  isVerified: boolean
  isApproved: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
  user: IUserDataType
  reviewImages: IReviewImageDataType[]
  replies?: IReviewReplyDataType[]
}

export interface IReviewSummaryDataType {
  productId: string
  averageRating: number
  totalReviews: number
  approvedReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface IGetReviewsParams {
  productId?: string
  userId?: string
  rating?: number
  isApproved?: boolean
  sortBy?: 'rating' | 'helpfulCount' | 'createdAt'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface IGetReviewRepliesParams {
  page?: number
  limit?: number
  sortBy?: 'createdAt'
  order?: 'asc' | 'desc'
}

export interface ICreateReviewDataType {
  productId: string
  rating: number
  title?: string
  comment?: string
  mediaIds?: string[]
}

export interface ICreateReviewReplyDataType {
  content: string
}

export interface IUpdateReviewDataType {
  rating?: number
  title?: string
  comment?: string
  mediaIds?: string[]
}

export interface IUpdateReviewReplyDataType {
  content: string
}

// ============ Admin Review Interfaces ============

export interface IReviewProductDataType {
  id: string
  name: string
  slug: string
}

export interface IReviewWithProductDataType extends IReviewDataType {
  product: IProductDataType
}

export interface IAdminReviewFilters {
  page?: number
  limit?: number
  productId?: string
  userId?: string
  rating?: number
  isApproved?: boolean
  sortBy?: 'rating' | 'helpfulCount' | 'createdAt'
  order?: 'asc' | 'desc'
  search?: string
  startDate?: string
  endDate?: string
}

export interface IAdminReviewStatsDataType {
  totalReviews: number
  approvedReviews: number
  pendingReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  recentReviewsTrend: {
    date: string
    count: number
    approvedCount: number
  }[]
}

export interface IAdminApproveReviewDataType {
  isApproved: boolean
}
