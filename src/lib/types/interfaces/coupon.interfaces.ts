export enum CouponType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export interface ICouponResponse {
  id: string;
  code: string;
  type: CouponType;
  value: string | number;
  minPurchase?: string | number;
  maxDiscount?: string | number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IApplyCouponPayload {
  code: string;
  subtotal: number;
}

export interface IApplyCouponResponse {
  coupon: ICouponResponse;
  calculatedDiscount: number;
  originalSubtotal: number;
  finalTotal: number;
}
