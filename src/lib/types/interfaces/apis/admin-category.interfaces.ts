// ============ Admin Category Types (mapped từ BE CategoryResponseDto) ============

export interface IAdminCategoryImageMedia {
  id: string;
  url: string;
  type: string;
  mimetype: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminCategoryBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  logoMedia?: IAdminCategoryImageMedia | null;
}

export interface IAdminCategoryDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description?: string;
  type?: 'CATEGORY' | 'BRAND';
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  imageMedia?: IAdminCategoryImageMedia | null;
  brand?: IAdminCategoryBrand | null;
  children?: IAdminCategoryDataType[];
}

// ============ Create / Update Payloads (maps to BE CreateCategoryDto) ============

export interface ICreateCategoryPayload {
  name: string;
  description?: string;
  parentId?: string;
  type?: 'CATEGORY' | 'BRAND';
  brandId?: string;
  sortOrder?: number;
  isActive?: boolean;
  // image sẽ gửi qua FormData
}

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
  parentId?: string;
  type?: 'CATEGORY' | 'BRAND';
  brandId?: string;
  sortOrder?: number;
  isActive?: boolean;
  // image sẽ gửi qua FormData
}

// ============ Form Data cho Dialog ============

export interface ICategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  type: 'CATEGORY' | 'BRAND';
  brandId?: string;
  parentId?: string;
  imageFile?: File | null;
  imagePreview?: string | null;
}
