// ============ Admin Brand Types (mapped từ BE BrandResponseDto) ============

export interface IAdminBrandLogoMedia {
  id: string;
  url: string;
  type: string;
  mimetype: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminBrandDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  isActive: boolean;
  logoMedia?: IAdminBrandLogoMedia | null;
}

// ============ Form Data cho Dialog ============

export interface IBrandFormData {
  name: string;
  description: string;
  website: string;
  isActive: boolean;
  logoFile?: File | null;
  logoPreview?: string | null;
}
