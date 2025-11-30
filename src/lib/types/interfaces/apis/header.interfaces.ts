// Base interface with common fields
interface ICategoryBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  imageMedia: ILogoMediaDataType | null;
  children: ICategoryDataType[];
}

// Brand category type - brand field is required
interface IBrandCategory extends ICategoryBase {
  type: 'BRAND';
  brand: IBrandDataType;
}

// Regular category type - brand field is null
interface IRegularCategory extends ICategoryBase {
  type: 'CATEGORY';
  brand: null;
}

// Discriminated union type
export type ICategoryDataType = IBrandCategory | IRegularCategory;

export interface IBrandDataType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  logoMediaId: string;
  website: null;
  logoMedia: ILogoMediaDataType | null;
}

export interface ILogoMediaDataType {
  id: string;
  url: string;
  type: string;
  mimetype: string;
  createdAt: string;
  updatedAt: string;
}
