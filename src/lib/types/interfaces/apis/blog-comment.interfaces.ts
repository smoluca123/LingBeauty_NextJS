import { IUserDataType } from './user.interfaces'

// ────────────────────────────────────────────────────────────────────────────────
// Blog Comment Types
// ────────────────────────────────────────────────────────────────────────────────

export interface IBlogCommentDataType {
  id: string
  postId: string
  userId: string
  parentId?: string
  content: string
  createdAt: Date
  updatedAt: Date
  user: IUserDataType
  replies?: IBlogCommentDataType[]
}

export interface IBlogCommentFilters {
  page?: number
  limit?: number
  postId?: string
  userId?: string
  parentId?: string | 'null'
}

export interface ICreateBlogCommentPayload {
  postId: string
  content: string
  parentId?: string
}

export interface IUpdateBlogCommentPayload {
  content: string
}

// ────────────────────────────────────────────────────────────────────────────────
// Blog Comment Report Types
// ────────────────────────────────────────────────────────────────────────────────

export enum BlogCommentReportReason {
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  HARASSMENT = 'HARASSMENT',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER',
}

export enum BlogCommentReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface IBlogCommentReportDataType {
  id: string
  commentId: string
  reporterId: string
  reason: BlogCommentReportReason
  description?: string
  status: BlogCommentReportStatus
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
  reporter: IUserDataType
  reviewer?: IUserDataType
  comment: {
    id: string
    content: string
    postId: string
  }
}

export interface IBlogCommentReportFilters {
  page?: number
  limit?: number
  status?: BlogCommentReportStatus
  reason?: BlogCommentReportReason
  commentId?: string
}

export interface ICreateBlogCommentReportPayload {
  commentId: string
  reason: BlogCommentReportReason
  description?: string
}

export interface IUpdateBlogCommentReportStatusPayload {
  status: BlogCommentReportStatus
}
