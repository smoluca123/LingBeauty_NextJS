/**
 * Admin Form Types
 * Types for admin panel forms
 */

export type BannerType = "TEXT" | "IMAGE";
export type BannerPosition = "MAIN_CAROUSEL" | "SIDE_TOP" | "SIDE_BOTTOM";
export type FlashSaleStatus = "UPCOMING" | "ACTIVE" | "ENDED";
export type CouponType = "FIXED" | "PERCENTAGE";

// Banner Forms
export interface CreateBannerFormValues {
  groupId?: string;
  type: BannerType;
  position: BannerPosition;
  badge?: string;
  title: string;
  description?: string;
  highlight?: string;
  ctaText?: string;
  ctaLink?: string;
  subLabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface EditBannerFormValues {
  type: BannerType;
  position: BannerPosition;
  badge?: string;
  title: string;
  description?: string;
  highlight?: string;
  ctaText?: string;
  ctaLink?: string;
  subLabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
  sortOrder: number;
  isActive: boolean;
}

// Banner Group Forms
export interface BannerGroupFormValues {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

// Flash Sale Forms
export interface FlashSaleFormValues {
  name: string;
  description?: string;
  slug: string;
  startTime: string;
  endTime: string;
  status: FlashSaleStatus;
  isActive: boolean;
  sortOrder: number;
}

// Coupon Forms
export interface CouponFormValues {
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
