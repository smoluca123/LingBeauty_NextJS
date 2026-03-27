# Admin Order Management

Module quản lý đơn hàng cho admin panel.

## Tính năng

### Danh sách đơn hàng

- Hiển thị tất cả đơn hàng với phân trang
- Tìm kiếm theo mã đơn hàng
- Lọc theo trạng thái đơn hàng
- Sắp xếp theo ngày tạo, tổng tiền, mã đơn hàng
- Hiển thị thông tin: mã đơn, trạng thái, số sản phẩm, tổng tiền, ngày tạo

### Chi tiết đơn hàng

- Xem đầy đủ thông tin đơn hàng
- Thông tin khách hàng (họ tên, SĐT)
- Địa chỉ giao hàng
- Danh sách sản phẩm với hình ảnh, giá, số lượng
- Thông tin thanh toán (tạm tính, phí ship, giảm giá, tổng cộng)
- Cập nhật trạng thái đơn hàng
- Thêm/sửa ghi chú đơn hàng

## Cấu trúc file

```
client/src/app/admin/orders/
├── components/
│   ├── orders-content.tsx       # Main content component
│   ├── order-table.tsx          # Table & filters
│   ├── order-detail-dialog.tsx  # Order detail dialog
│   └── index.ts                 # Exports
├── page.tsx                     # Page entry
└── README.md                    # Documentation
```

## API Endpoints

### Backend (NestJS)

- `GET /order` - Lấy danh sách đơn hàng (Admin only)
- `GET /order/admin/:orderId` - Lấy chi tiết đơn hàng bất kỳ (Admin only)
- `PATCH /order/:orderId` - Cập nhật đơn hàng (Admin only)
- `GET /order/:orderId` - Lấy chi tiết đơn hàng của user hiện tại
- `GET /order/my-orders` - Lấy danh sách đơn hàng của user hiện tại

### Frontend (Next.js API Routes)

- `GET /api/admin/orders` - Proxy to backend GET /order
- `GET /api/admin/orders/:orderId` - Proxy to backend GET /order/admin/:orderId
- `PATCH /api/admin/orders/:orderId` - Proxy to backend PATCH /order/:orderId

## Query Params

### GET /order (Admin)

- `page` - Số trang (default: 1)
- `limit` - Số items/trang (default: 10)
- `userId` - Lọc theo user ID
- `status` - Lọc theo trạng thái
- `orderNumber` - Tìm kiếm theo mã đơn
- `sortBy` - Sắp xếp theo field (createdAt, total, orderNumber)
- `order` - Thứ tự sắp xếp (asc, desc)

## Order Status

- `PENDING` - Chờ xác nhận
- `CONFIRMED` - Đã xác nhận
- `PROCESSING` - Đang chuẩn bị
- `SHIPPED` - Đang giao
- `DELIVERED` - Đã giao
- `CANCELLED` - Đã hủy
- `REFUNDED` - Đã hoàn tiền

## Usage

### Hooks

```tsx
// Query danh sách đơn hàng
const { data, isLoading } = useAdminOrdersQuery({
  page: 1,
  limit: 10,
  status: 'PENDING',
  sortBy: 'createdAt',
  order: 'desc',
})

// Query chi tiết đơn hàng
const { data } = useAdminOrderDetailQuery(orderId)

// Mutation cập nhật đơn hàng
const updateMutation = useUpdateOrderMutation(orderId)
updateMutation.mutate({
  status: 'CONFIRMED',
  notes: 'Đã xác nhận đơn hàng',
})
```

### Components

```tsx
import { OrdersContent } from './components'

export default function AdminOrdersPage() {
  return <OrdersContent />
}
```

## Permissions

Tất cả endpoints yêu cầu:

- Authentication (JWT token)
- Admin role (role = 3)

## Notes

- Pagination được xử lý ở server-side
- Filters được debounce 300ms để giảm số lượng API calls
- Order detail dialog tự động load data khi mở
- Status update sẽ invalidate cả list và detail queries
