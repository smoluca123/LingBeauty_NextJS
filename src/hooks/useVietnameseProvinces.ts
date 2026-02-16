'use client';

import { useState, useEffect, useCallback } from 'react';
import { kyClientInstance } from '@/lib/kyInstance/kyClient';

// V1 Types (3-level: Province -> District -> Ward)
export interface ProvinceWardV1 {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}

export interface ProvinceDistrictV1 {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: ProvinceWardV1[];
}

export interface ProvinceV1 {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: ProvinceDistrictV1[];
}

// V2 Types (2-level: Province -> Ward, no districts)
export interface ProvinceWardV2 {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}

export interface ProvinceV2 {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  wards: ProvinceWardV2[];
}

// Union type for both versions
export type Province = ProvinceV1 | ProvinceV2;

/**
 * Backend response wrapper type
 */
interface BackendResponse<T> {
  type: 'response';
  data: T;
  message: string;
  statusCode: number;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export type ApiVersion = 'v1' | 'v2';

interface UseVietnameseProvincesOptions {
  /**
   * API version to use:
   * - v1: Before administrative merger (3-level: Province -> District -> Ward)
   * - v2: After administrative merger (2-level: Province -> Ward)
   * @default 'v2'
   */
  version?: ApiVersion;
}

/**
 * Get API URL based on version
 */
const getApiUrl = (version: ApiVersion): string => {
  return `provinces/${version}`;
};

/**
 * Get cache keys based on version
 */
const getCacheKey = (version: ApiVersion) => ({
  data: `vietnam_provinces_cache_${version}`,
  expiry: `vietnam_provinces_cache_expiry_${version}`,
});

/**
 * Check if province is V1 (has districts)
 */
export function isProvinceV1(province: Province): province is ProvinceV1 {
  return 'districts' in province;
}

/**
 * Check if province is V2 (has wards directly, no districts)
 */
export function isProvinceV2(province: Province): province is ProvinceV2 {
  return 'wards' in province && !('districts' in province);
}

/**
 * Hook to fetch Vietnamese provinces, districts, and wards data
 */
export function useVietnameseProvinces(
  options: UseVietnameseProvincesOptions = {},
) {
  const { version = 'v1' } = options;
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: cacheKey, expiry: expiryKey } = getCacheKey(version);

  // Helper to get cached data
  const getCachedData = useCallback((): Province[] | null => {
    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cacheExpiry = localStorage.getItem(expiryKey);

      if (cachedData && cacheExpiry) {
        const expiryTime = parseInt(cacheExpiry, 10);
        if (Date.now() < expiryTime) {
          return JSON.parse(cachedData);
        }
      }
    } catch (err) {
      console.error('Error reading cache:', err);
    }
    return null;
  }, [cacheKey, expiryKey]);

  // Helper to set cached data
  const setCachedData = useCallback(
    (data: Province[]) => {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(
          expiryKey,
          (Date.now() + CACHE_DURATION).toString(),
        );
      } catch (err) {
        console.error('Error setting cache:', err);
      }
    },
    [cacheKey, expiryKey],
  );

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        if (typeof window !== 'undefined') {
          const cached = getCachedData();
          if (cached) {
            setProvinces(cached);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        const apiUrl = getApiUrl(version);
        const response = await kyClientInstance
          .get(apiUrl)
          .json<BackendResponse<Province[]>>();

        // Extract data from response wrapper
        const data = response.data;

        // Update state and cache
        setProvinces(data);
        setCachedData(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch provinces data',
        );

        // Try to use cached data as fallback even if expired
        if (typeof window !== 'undefined') {
          try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
              setProvinces(JSON.parse(cachedData));
            }
          } catch (cacheErr) {
            console.error('Error reading fallback cache:', cacheErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [version, cacheKey, expiryKey, setCachedData, getCachedData]);

  return {
    provinces,
    loading,
    error,
    version,
  };
}
