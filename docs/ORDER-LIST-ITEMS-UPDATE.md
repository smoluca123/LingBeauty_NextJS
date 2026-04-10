# Cập nhật API Order List - Thêm thông tin sản phẩm

## Tổng quan

Cập nhật API `GET /order` và `GET /order/my-orders` để trả về thông tin chi tiết sản phẩm (summary) trong danh sách đơn hàng.

## ✅ Đã hoàn thành

### Backend

- ✅ Cập nhật `orderListSelect` sử dụng `productSummarySelect` và `variantSummarySelect`
- ✅ Cập nhật `OrderListItemDto` với `OrderListItemItemDto` chứa ProductSummary và VariantSummary
- ✅ Service không cần thay đổi (đã dùng `orderListSelect`)

### Frontend

- ✅ Thêm `IProductSummaryDataType` và `IVariantSummaryDataType`
- ✅ Cập nhật `IOrderListItemDataType` với items array chứa summary types
- ✅ Cập nhật UI component `OrderTable` hiển thị ảnh + tên + giá sản phẩm

## Chi tiết thay đổi

### 1. Backend - Prisma Select

**File:** `server/src/libs/prisma/order-select.ts`

```typescript
export const orderListSelect = {
  id: true,
  userId: true,
  orderNumber: true,
  status: true,
  total: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      orderId: true,
      productId: true,
      variantId: true,
      name: true,
      sku: true,
      price: true,
      quantity: true,
      total: true,
      createdAt: true,
      product: {
        select: productSummarySelect, // ✅ Sử dụng summary
      },
      variant: {
        select: variantSummarySelect, // ✅ Sử dụng summary
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.OrderSelect
```

### 2. Backend - Response DTO

**File:** `server/src/modules/order/dto/order-response.dto.ts`

Thêm imports:

```typescript
import { ProductSummaryResponseDto } from 'src/modules/product/dto/product-response.dto'
import { VariantSummaryResponseDto } from 'src/modules/product/dto/product-variant.dto'
```

Thêm DTOs:

```typescript
export class OrderListItemItemDto {
  @Expose() @ApiProperty() id!: string
  @Expose() @ApiProperty() orderId!: string
  @Expose() @ApiProperty() productId!: string
  @Expose() @ApiProperty() variantId!: string
  @Expose() @ApiProperty() name!: string
  @Expose() @ApiProperty() sku!: string
  @Expose() @ApiProperty() price!: string
  @Expose() @ApiProperty() quantity!: number
  @Expose() @ApiProperty() total!: string
  @Expose() @Type(() => Date) @ApiProperty() createdAt!: Date

  @Expose()
  @Type(() => ProductSummaryResponseDto)
  @ApiProperty({ type: ProductSummaryResponseDto })
  product!: ProductSummaryResponseDto

  @Expose()
  @Type(() => VariantSummaryResponseDto)
  @ApiProperty({ type: VariantSummaryResponseDto })
  variant!: VariantSummaryResponseDto
}

export class OrderListItemDto {
  @Expose() @ApiProperty() id!: string
  @Expose() @ApiProperty() userId!: string
  @Expose() @ApiProperty() orderNumber!: string
  @Expose() @ApiProperty({ enum: OrderStatus }) status!: OrderStatus
  @Expose() @ApiProperty() total!: string
  @Expose() @Type(() => Date) @ApiProperty() createdAt!: Date
  @Expose() @Type(() => Date) @ApiProperty() updatedAt!: Date

  @Expose()
  @Type(() => OrderListItemItemDto)
  @ApiProperty({ type: [OrderListItemItemDto] })
  items!: OrderListItemItemDto[]

  @Expose()
  @ApiProperty()
  itemCount!: number
}
```

### 3. Frontend - Type Definitions

**File:** `client/src/lib/types/interfaces/apis/product.interfaces.ts`

```typescript
export interface IProductSummaryDataType {
  id: string
  name: string
  slug: string
  sku: string | null
  basePrice: string
  comparePrice?: string | null
  isActive: boolean
  brand?: IProductBrandDataType | null
  images: IProductImageDataType[]
}

export interface IVariantSummaryDataType {
  id: string
  sku: string
  name: string
  color: string | null
  size: string | null
  type: string | null
  price: string
  displayType: VariantDisplayType
  images: IProductImageDataType[]
}
```

**File:** `client/src/lib/types/interfaces/apis/order.interfaces.ts`

```typescript
import type {
  IProductSummaryDataType,
  IVariantSummaryDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'

export interface IOrderListItemDataType {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  total: string
  createdAt: Date
  updatedAt: Date
  itemCount: number
  items: Array<{
    id: string
    orderId: string
    productId: string
    variantId: string
    name: string
    sku: string
    price: string
    quantity: number
    total: string
    createdAt: Date
    product: IProductSummaryDataType
    variant: IVariantSummaryDataType
  }>
}
```

### 4. Frontend - UI Component

**File:** `client/src/app/admin/orders/components/order-table.tsx`

- Thêm import: `import Image from 'next/image'` và `Package` icon
- Thay cột "Số sản phẩm" bằng cột "Sản phẩm"
- Hiển thị ảnh sản phẩm đầu tiên (48x48px)
- Hiển thị tên sản phẩm + quantity x price
- Hiển thị "+X sản phẩm khác" nếu có nhiều items

## Response Structure

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "orderNumber": "ORD-260327-0004",
      "status": "PENDING",
      "total": "1292800",
      "createdAt": "2026-03-27T23:36:00Z",
      "updatedAt": "2026-03-27T23:36:00Z",
      "itemCount": 2,
      "items": [
        {
          "id": "uuid",
          "orderId": "uuid",
          "productId": "uuid",
          "variantId": "uuid",
          "name": "Son môi đỏ Matte",
          "sku": "SKU-123",
          "price": "299000",
          "quantity": 1,
          "total": "299000",
          "createdAt": "2026-03-27T23:36:00Z",
          "product": {
            "id": "uuid",
            "name": "Son môi đỏ Matte",
            "slug": "son-moi-do-matte",
            "sku": "LP-001",
            "basePrice": "299000",
            "comparePrice": "350000",
            "isActive": true,
            "brand": {
              "id": "uuid",
              "name": "L'Oreal",
              "slug": "loreal"
            },
            "images": [
              {
                "id": "uuid",
                "media": {
                  "url": "https://..."
                }
              }
            ]
          },
          "variant": {
            "id": "uuid",
            "sku": "SKU-123",
            "name": "Màu đỏ - Size M",
            "color": "Đỏ",
            "size": "M",
            "type": null,
            "price": "299000",
            "displayType": "COLOR",
            "images": []
          }
        }
      ]
    }
  ],
  "pagination": {
    "totalCount": 100,
    "currentPage": 1,
    "pageSize": 20
  }
}
```

## Performance

**Ưu điểm:**

- ✅ Đồng nhất data structure
- ✅ Sử dụng summary select (nhẹ hơn full product)
- ✅ Chỉ lấy 1 ảnh đầu tiên cho product/variant

**Response size:**

- Trước: ~200 bytes/order
- Sau: ~800-1200 bytes/order
- Với 20 orders/page: tăng ~12-20KB

## Testing

### Backend

```bash
# Test endpoint
GET http://localhost:3000/order?page=1&limit=20

# Verify response có items với product và variant summary
```

### Frontend

```bash
# Run dev server
cd client && npm run dev

# Navigate to /admin/orders
# Verify hiển thị ảnh + tên sản phẩm trong bảng
```

---

**Status:** ✅ Completed  
**Date:** 2026-04-09
