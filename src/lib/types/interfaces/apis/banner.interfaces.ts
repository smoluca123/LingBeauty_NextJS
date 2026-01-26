export interface IBannerMediaType {
  id: string;
  url: string;
  key: string;
  filename: string;
  mimetype: string;
  size: number;
  type: string;
}

export interface IBannerDataType {
  id: string;
  type: 'TEXT' | 'IMAGE';
  position: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
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

// Junction table mapping interface
export interface IBannerGroupMapping {
  id: string;
  bannerId: string;
  bannerGroupId: string;
  sortOrder: number;
  createdAt: string;
  banner: IBannerDataType;
}

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
  banners: IBannerGroupMapping[]; // Changed from IBannerDataType[] to mapping array
}
