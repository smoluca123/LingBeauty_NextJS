import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';

// Mock categories for filter
export interface FilterCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const mockCategories: FilterCategory[] = [
  { id: '1', name: 'Gấu bông', slug: 'gau-bong', count: 6 },
  { id: '2', name: 'Móc khóa', slug: 'moc-khoa', count: 7 },
  { id: '3', name: 'Túi xách', slug: 'tui-xach', count: 3 },
  { id: '4', name: 'Phụ kiện', slug: 'phu-kien', count: 4 },
];

// Price ranges for filter
export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export const priceRanges: PriceRange[] = [
  { id: 'under-500k', label: 'Dưới 500.000đ', min: 0, max: 500000 },
  { id: '500k-1m', label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
  { id: '1m-1.5m', label: '1.000.000đ - 1.500.000đ', min: 1000000, max: 1500000 },
  { id: '1.5m-2m', label: '1.500.000đ - 2.000.000đ', min: 1500000, max: 2000000 },
  { id: 'over-2m', label: 'Trên 2.000.000đ', min: 2000000, max: null },
];

// Sort options
export interface SortOption {
  id: string;
  label: string;
  value: string;
}

export const sortOptions: SortOption[] = [
  { id: 'all', label: 'Tất cả', value: 'all' },
  { id: 'newest', label: 'Mới nhất', value: 'newest' },
  { id: 'price-asc', label: 'Giá thấp - cao', value: 'price-asc' },
  { id: 'price-desc', label: 'Giá cao - thấp', value: 'price-desc' },
  { id: 'best-seller', label: 'Bán chạy', value: 'best-seller' },
];

// Helper function to create media object
const createMedia = (id: string, url: string) => ({
  id,
  url,
  type: 'IMAGE',
  mimetype: 'image/jpeg',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
});

// Helper function to create brand object
const createBrand = () => ({
  id: 'brand-1',
  name: 'MIFFY',
  slug: 'miffy',
  description: 'Miffy brand',
  logoMediaId: 'logo-1',
  website: null,
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  logoMedia: createMedia('logo-1', '/images/brands/miffy-logo.png'),
});

// Helper function to create category
const createCategory = (
  id: string,
  name: string,
  slug: string,
  sortOrder: number
) => ({
  category: {
    id,
    name,
    slug,
    description: '',
    imageMediaId: null,
    parentId: null,
    type: 'product',
    brand: null,
    isActive: true,
    sortOrder,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    imageMedia: null,
  },
});

// Mock products data
export const mockProducts: IProductDataType[] = [
  {
    id: '1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    name: 'Móc Khóa Melanie Cà Rốt Vipo Melanie With Carrot Keychain',
    slug: 'moc-khoa-melanie-ca-rot',
    shortDesc: 'Móc khóa Miffy Melanie cầm cà rốt siêu đáng yêu',
    sku: 'MIFFY-001',
    basePrice: '298000',
    comparePrice: '350000',
    isActive: true,
    isFeatured: true,
    brand: createBrand(),
    primaryImage: {
      id: 'img-1',
      productId: '1',
      variantId: '',
      mediaId: 'media-1',
      alt: 'Móc Khóa Melanie Cà Rốt',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-1',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1068web_f57afc49ca0241908f2de6f9e9d3e0b3_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [
      {
        id: 'badge-1',
        productId: '1',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 100,
    },
  },
  {
    id: '2',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    name: 'Đồ Chơi Nhồi Bông Miffy Vương Miện Vipo Miffy With Crown Plush',
    slug: 'do-choi-nhoi-bong-miffy-vuong-mien',
    shortDesc: 'Miffy nhồi bông với vương miện đáng yêu',
    sku: 'MIFFY-002',
    basePrice: '340000',
    comparePrice: '400000',
    isActive: true,
    isFeatured: true,
    brand: createBrand(),
    primaryImage: {
      id: 'img-2',
      productId: '2',
      variantId: '',
      mediaId: 'media-2',
      alt: 'Miffy Vương Miện',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-2',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1018web_ff3d8bebb3364b62859e9f86ddfb97e2_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-1', 'Gấu bông', 'gau-bong', 0)],
    variants: [],
    badges: [
      {
        id: 'badge-2',
        productId: '2',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 150,
    },
  },
  {
    id: '3',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
    name: 'Đồ Chơi Nhồi Bông Melanie Tulip Vipo Melanie With Tulip Plush',
    slug: 'do-choi-nhoi-bong-melanie-tulip',
    shortDesc: 'Melanie nhồi bông cầm hoa tulip',
    sku: 'MIFFY-003',
    basePrice: '340000',
    comparePrice: '400000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-3',
      productId: '3',
      variantId: '',
      mediaId: 'media-3',
      alt: 'Melanie Tulip',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-3',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1039web_c01b9f51c8f44ce783ca8da62a28bb69_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-1', 'Gấu bông', 'gau-bong', 0)],
    variants: [],
    badges: [
      {
        id: 'badge-3',
        productId: '3',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 80,
    },
  },
  {
    id: '4',
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z',
    name: 'Móc Khóa Boris 2D Vipo x Boris 2D Keychain (6.5cm)',
    slug: 'moc-khoa-boris-2d',
    shortDesc: 'Móc khóa Boris 2D siêu cute',
    sku: 'MIFFY-004',
    basePrice: '166000',
    comparePrice: '200000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-4',
      productId: '4',
      variantId: '',
      mediaId: 'media-4',
      alt: 'Boris 2D Keychain',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-4',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1071web_68e99492ba864db8b6ba05f1a41d4eba_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 60,
    },
  },
  {
    id: '5',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
    name: 'Móc Khóa Miffy Dâu Tây Vipo Miffy With Strawberry Keychain',
    slug: 'moc-khoa-miffy-dau-tay',
    shortDesc: 'Móc khóa Miffy cầm dâu tây',
    sku: 'MIFFY-005',
    basePrice: '298000',
    comparePrice: '350000',
    isActive: true,
    isFeatured: true,
    brand: createBrand(),
    primaryImage: {
      id: 'img-5',
      productId: '5',
      variantId: '',
      mediaId: 'media-5',
      alt: 'Miffy Dâu Tây',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-5',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1092web_8df0a8d95c014627abe3b9ea9fa1509b_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [
      {
        id: 'badge-5',
        productId: '5',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 120,
    },
  },
  {
    id: '6',
    createdAt: '2025-01-06T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
    name: 'Móc Khóa Melanie Dâu Tây Vipo Melanie With Strawberry Keychain',
    slug: 'moc-khoa-melanie-dau-tay',
    shortDesc: 'Móc khóa Melanie cầm dâu tây',
    sku: 'MIFFY-006',
    basePrice: '298000',
    comparePrice: '350000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-6',
      productId: '6',
      variantId: '',
      mediaId: 'media-6',
      alt: 'Melanie Dâu Tây',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-6',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1095web_46c4b71c0f254d749f2f0feb6f20b1c6_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [
      {
        id: 'badge-6',
        productId: '6',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 90,
    },
  },
  {
    id: '7',
    createdAt: '2025-01-07T00:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
    name: 'Móc Khóa Miffy Táo Đỏ Vipo Miffy With Apple Keychain',
    slug: 'moc-khoa-miffy-tao-do',
    shortDesc: 'Móc khóa Miffy cầm táo đỏ',
    sku: 'MIFFY-007',
    basePrice: '298000',
    comparePrice: '350000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-7',
      productId: '7',
      variantId: '',
      mediaId: 'media-7',
      alt: 'Miffy Táo Đỏ',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-7',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1098web_3e6db80c6c1d40928b1f2b5b3c5e6d7a_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [
      {
        id: 'badge-7',
        productId: '7',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 75,
    },
  },
  {
    id: '8',
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
    name: 'Móc Khóa Miffy Cà Rốt Vipo Miffy With Carrot Keychain',
    slug: 'moc-khoa-miffy-ca-rot',
    shortDesc: 'Móc khóa Miffy cầm cà rốt',
    sku: 'MIFFY-008',
    basePrice: '298000',
    comparePrice: '350000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-8',
      productId: '8',
      variantId: '',
      mediaId: 'media-8',
      alt: 'Miffy Cà Rốt',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-8',
        'https://product.hstatic.net/200000930001/product/20102025_linhdinh_khoaminh_miffy_1101web_5a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [
      {
        id: 'badge-8',
        productId: '8',
        name: 'MỚI',
        sortOrder: 0,
        isActive: true,
        variant: 'PRIMARY',
        type: 'NEW',
      },
    ],
    stats: {
      totalSold: 0,
      avgRating: '0',
      reviewCount: 0,
      viewCount: 85,
    },
  },
  {
    id: '9',
    createdAt: '2025-01-09T00:00:00Z',
    updatedAt: '2025-01-09T00:00:00Z',
    name: 'Gấu Bông Miffy Ngồi Size Lớn Vipo Miffy Sitting Plush Large',
    slug: 'gau-bong-miffy-ngoi-size-lon',
    shortDesc: 'Gấu bông Miffy ngồi size lớn 40cm',
    sku: 'MIFFY-009',
    basePrice: '890000',
    comparePrice: '1000000',
    isActive: true,
    isFeatured: true,
    brand: createBrand(),
    primaryImage: {
      id: 'img-9',
      productId: '9',
      variantId: '',
      mediaId: 'media-9',
      alt: 'Gấu Bông Miffy Size Lớn',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-9',
        'https://product.hstatic.net/200000930001/product/miffy_sitting_large_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-1', 'Gấu bông', 'gau-bong', 0)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 25,
      avgRating: '4.8',
      reviewCount: 12,
      viewCount: 300,
    },
  },
  {
    id: '10',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
    name: 'Túi Đeo Vai Miffy Mini Bag Vipo Miffy Shoulder Bag',
    slug: 'tui-deo-vai-miffy-mini-bag',
    shortDesc: 'Túi đeo vai hình Miffy siêu đáng yêu',
    sku: 'MIFFY-010',
    basePrice: '550000',
    comparePrice: '650000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-10',
      productId: '10',
      variantId: '',
      mediaId: 'media-10',
      alt: 'Túi Đeo Vai Miffy',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-10',
        'https://product.hstatic.net/200000930001/product/miffy_shoulder_bag_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-3', 'Túi xách', 'tui-xach', 2)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 18,
      avgRating: '4.5',
      reviewCount: 8,
      viewCount: 200,
    },
  },
  {
    id: '11',
    createdAt: '2025-01-11T00:00:00Z',
    updatedAt: '2025-01-11T00:00:00Z',
    name: 'Gấu Bông Boris Ngồi Size Vừa Vipo Boris Sitting Plush Medium',
    slug: 'gau-bong-boris-ngoi-size-vua',
    shortDesc: 'Gấu bông Boris ngồi size vừa 25cm',
    sku: 'MIFFY-011',
    basePrice: '450000',
    comparePrice: '520000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-11',
      productId: '11',
      variantId: '',
      mediaId: 'media-11',
      alt: 'Gấu Bông Boris Size Vừa',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-11',
        'https://product.hstatic.net/200000930001/product/boris_sitting_medium_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-1', 'Gấu bông', 'gau-bong', 0)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 15,
      avgRating: '4.6',
      reviewCount: 6,
      viewCount: 150,
    },
  },
  {
    id: '12',
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
    name: 'Ốp Điện Thoại Miffy iPhone Case Vipo Miffy Phone Case',
    slug: 'op-dien-thoai-miffy-iphone-case',
    shortDesc: 'Ốp điện thoại Miffy cho iPhone',
    sku: 'MIFFY-012',
    basePrice: '250000',
    comparePrice: '300000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-12',
      productId: '12',
      variantId: '',
      mediaId: 'media-12',
      alt: 'Ốp Điện Thoại Miffy',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-12',
        'https://product.hstatic.net/200000930001/product/miffy_phone_case_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-4', 'Phụ kiện', 'phu-kien', 3)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 30,
      avgRating: '4.3',
      reviewCount: 15,
      viewCount: 250,
    },
  },
  {
    id: '13',
    createdAt: '2025-01-13T00:00:00Z',
    updatedAt: '2025-01-13T00:00:00Z',
    name: 'Gấu Bông Melanie Váy Hồng Vipo Melanie Pink Dress Plush',
    slug: 'gau-bong-melanie-vay-hong',
    shortDesc: 'Gấu bông Melanie mặc váy hồng',
    sku: 'MIFFY-013',
    basePrice: '520000',
    comparePrice: '600000',
    isActive: true,
    isFeatured: true,
    brand: createBrand(),
    primaryImage: {
      id: 'img-13',
      productId: '13',
      variantId: '',
      mediaId: 'media-13',
      alt: 'Gấu Bông Melanie Váy Hồng',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-13',
        'https://product.hstatic.net/200000930001/product/melanie_pink_dress_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-1', 'Gấu bông', 'gau-bong', 0)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 20,
      avgRating: '4.9',
      reviewCount: 10,
      viewCount: 280,
    },
  },
  {
    id: '14',
    createdAt: '2025-01-14T00:00:00Z',
    updatedAt: '2025-01-14T00:00:00Z',
    name: 'Móc Khóa Miffy Hoa Hướng Dương Vipo Miffy Sunflower Keychain',
    slug: 'moc-khoa-miffy-hoa-huong-duong',
    shortDesc: 'Móc khóa Miffy cầm hoa hướng dương',
    sku: 'MIFFY-014',
    basePrice: '298000',
    comparePrice: '350000',
    isActive: true,
    isFeatured: false,
    brand: createBrand(),
    primaryImage: {
      id: 'img-14',
      productId: '14',
      variantId: '',
      mediaId: 'media-14',
      alt: 'Miffy Hoa Hướng Dương',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-14',
        'https://product.hstatic.net/200000930001/product/miffy_sunflower_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-2', 'Móc khóa', 'moc-khoa', 1)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 8,
      avgRating: '4.4',
      reviewCount: 4,
      viewCount: 100,
    },
  },
  {
    id: '15',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    name: 'Balo Miffy Mini Backpack Vipo Miffy Kids Backpack',
    slug: 'balo-miffy-mini-backpack',
    shortDesc: 'Balo mini hình Miffy cho bé',
    sku: 'MIFFY-015',
    basePrice: '750000',
    comparePrice: '850000',
    isActive: true,
    isFeatured: true,
    brand: createBrand(),
    primaryImage: {
      id: 'img-15',
      productId: '15',
      variantId: '',
      mediaId: 'media-15',
      alt: 'Balo Miffy Mini',
      sortOrder: 0,
      isPrimary: true,
      media: createMedia(
        'media-15',
        'https://product.hstatic.net/200000930001/product/miffy_backpack_1024x1024.jpg'
      ),
    },
    productCategories: [createCategory('cat-3', 'Túi xách', 'tui-xach', 2)],
    variants: [],
    badges: [],
    stats: {
      totalSold: 12,
      avgRating: '4.7',
      reviewCount: 7,
      viewCount: 180,
    },
  },
];

// Get products by brand slug
export function getProductsByBrandSlug(brandSlug: string): IProductDataType[] {
  return mockProducts.filter(
    (product) => product.brand.slug.toLowerCase() === brandSlug.toLowerCase()
  );
}
