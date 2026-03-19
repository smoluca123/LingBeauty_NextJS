/**
 * Coupon type enum - matches server CouponType
 */
export type TCouponType = 'FIXED' | 'PERCENTAGE';

/**
 * Coupon data interface - matches server CouponResponseDto
 */
export interface ICouponDataType {
  id: string;
  code: string;
  type: TCouponType;
  value: number | string;
  minPurchase?: number | string;
  maxDiscount?: number | string;
  usageLimit?: number;
  usedCount: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Form data for creating a coupon
 */
export interface ICreateCouponFormData {
  code: string;
  type: TCouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

/**
 * Form data for updating a coupon
 */
export type IUpdateCouponFormData = Partial<ICreateCouponFormData>;

/**
 * Coupon filter params for list queries
 */
export interface ICouponFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?:
    | 'createdAt'
    | 'code'
    | 'value'
    | 'usedCount'
    | 'startDate'
    | 'endDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Coupon status for UI display
 */
export type TCouponStatus =
  | 'active'
  | 'expired'
  | 'upcoming'
  | 'inactive'
  | 'exhausted';

/**
 * Extended coupon data with computed status
 */
export interface ICouponWithStatus extends ICouponDataType {
  status: TCouponStatus;
  usagePercentage: number;
}
