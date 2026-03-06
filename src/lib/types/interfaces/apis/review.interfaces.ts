import { IMediaDataType } from '@/lib/types/interfaces/apis/image.interfaces';

export interface IReviewUserDataType {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarMedia?: IMediaDataType;
}

export interface IReviewImageDataType {
  id: string;
  reviewId: string;
  mediaId: string;
  alt: string | null;
  createdAt: Date;
  media: IMediaDataType;
}

export interface IReviewDataType {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: IReviewUserDataType;
  reviewImages: IReviewImageDataType[];
}

export interface IGetReviewsParams {
  productId?: string;
  userId?: string;
  rating?: number;
  isApproved?: boolean;
  sortBy?: 'rating' | 'helpfulCount' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
