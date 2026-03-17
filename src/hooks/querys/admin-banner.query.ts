import { useQuery } from '@tanstack/react-query';
import {
  getAllBannerGroupsClientAPI,
  getBannerGroupByIdClientAPI,
  getBannerGroupsClientAPI,
  getAllBannersClientAPI,
} from '@/lib/apis/client/admin-banner.apis';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminBannerQueryKeys = {
  bannerGroups: ['admin', 'banner-groups'] as const,
  bannerGroup: (id: string) => ['admin', 'banner-group', id] as const,
  bannerGroupsOfBanner: (bannerId: string) =>
    ['admin', 'banner', bannerId, 'groups'] as const,
  banners: ['admin', 'banners'] as const,
};

// ── Get All Banners ──────────────────────────────────────────────────────────

export const useAdminBannersQuery = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  groupId?: string;
}) =>
  useQuery({
    queryKey: [...adminBannerQueryKeys.banners, params],
    queryFn: () => getAllBannersClientAPI(params),
    staleTime: 1000 * 60 * 2, // 2 phút
  });

// ── Get All Banner Groups ────────────────────────────────────────────────────

export const useAdminBannerGroupsQuery = (params?: {
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: [...adminBannerQueryKeys.bannerGroups, params],
    queryFn: () => getAllBannerGroupsClientAPI(params),
    staleTime: 1000 * 60 * 2, // 2 phút
  });

// ── Get Banner Group by ID ───────────────────────────────────────────────────

export const useAdminBannerGroupQuery = (id: string) =>
  useQuery({
    queryKey: adminBannerQueryKeys.bannerGroup(id),
    queryFn: () => getBannerGroupByIdClientAPI(id),
    staleTime: 1000 * 60 * 2,
    enabled: !!id,
  });

// ── Get All Groups of a Banner ───────────────────────────────────────────────

export const useBannerGroupsOfBannerQuery = (bannerId: string) =>
  useQuery({
    queryKey: adminBannerQueryKeys.bannerGroupsOfBanner(bannerId),
    queryFn: () => getBannerGroupsClientAPI(bannerId),
    staleTime: 1000 * 60 * 1, // 1 phút
    enabled: !!bannerId,
  });
