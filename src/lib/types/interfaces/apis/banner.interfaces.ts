// ═══════════════════════════════════════════════════════════════════════════════
// Banner Module TypeScript Interfaces
// Synchronized with backend entities and DTOs
// ═══════════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────────
// Media Types
// ───────────────────────────────────────────────────────────────────────────────

export interface IBannerMediaType {
  id: string;
  url: string;
  key: string;
  filename: string;
  mimetype: string;
  size: number;
  type: string;
}

// ───────────────────────────────────────────────────────────────────────────────
// Banner Types
// ───────────────────────────────────────────────────────────────────────────────

export type BannerType = 'TEXT' | 'IMAGE';
export type BannerPosition = 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';

// ───────────────────────────────────────────────────────────────────────────────
// Banner Data Interface (matches BannerResponseDto)
// ───────────────────────────────────────────────────────────────────────────────

export interface IBannerDataType {
  id: string;
  type: BannerType;
  position: BannerPosition;
  badge: string | null;
  title: string | null;
  description: string | null;
  highlight: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  subLabel: string | null;
  gradientFrom: string | null;
  gradientTo: string | null;
  imageMediaId: string | null;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imageMedia?: IBannerMediaType;
  groups?: Array<{
    bannerGroupId: string;
  }>;
}

// ───────────────────────────────────────────────────────────────────────────────
// Banner Group Mapping Interface (matches BannerMappingResponseDto)
// ───────────────────────────────────────────────────────────────────────────────

export interface IBannerGroupMapping {
  id: string;
  bannerId: string;
  bannerGroupId: string;
  sortOrder: number;
  createdAt: string;
  banner?: IBannerDataType;
}

// ───────────────────────────────────────────────────────────────────────────────
// Banner Group Data Interface (matches BannerGroupResponseDto)
// ───────────────────────────────────────────────────────────────────────────────

export interface IBannerGroupDataType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  banners?: IBannerGroupMapping[];
}

// ───────────────────────────────────────────────────────────────────────────────
// DTOs for Create/Update Operations
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Create Banner Group DTO (matches CreateBannerGroupDto)
 */
export interface ICreateBannerGroupDto {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Update Banner Group DTO (matches UpdateBannerGroupDto - PartialType)
 */
export type IUpdateBannerGroupDto = Partial<ICreateBannerGroupDto>;

/**
 * Create Banner DTO (matches CreateBannerDto)
 */
export interface ICreateBannerDto {
  type: BannerType;
  position: BannerPosition;
  badge?: string;
  title?: string;
  description?: string;
  highlight?: string;
  ctaText?: string;
  ctaLink?: string;
  subLabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageMediaId?: string;
  sortOrder?: number;
  isActive?: boolean;
  groupId?: string;
}

/**
 * Update Banner DTO (matches UpdateBannerDto - PartialType)
 */
export type IUpdateBannerDto = Partial<ICreateBannerDto>;

// ───────────────────────────────────────────────────────────────────────────────
// Request/Response DTOs for Group Management
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Bulk Remove Banners DTO (matches BulkRemoveBannersDto)
 */
export interface IBulkRemoveBannersDto {
  bannerIds: string[];
}

/**
 * Reorder Banner Item DTO (matches ReorderBannerItemDto)
 */
export interface IReorderBannerItemDto {
  bannerId: string;
  sortOrder: number;
}

/**
 * Reorder Banners DTO (matches ReorderBannersDto)
 */
export interface IReorderBannersDto {
  orderData: IReorderBannerItemDto[];
}

// ───────────────────────────────────────────────────────────────────────────────
// Query Parameters
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Get All Banner Groups Query Params
 */
export interface IGetAllBannerGroupsParams {
  page?: number;
  limit?: number;
  bannerId?: string;
}

/**
 * Get All Banners Query Params
 */
export interface IGetAllBannersParams {
  page?: number;
  limit?: number;
  search?: string;
  groupId?: string;
}
