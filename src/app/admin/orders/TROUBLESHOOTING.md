# Troubleshooting - Admin Orders Module

## Lỗi 404 khi gọi API `/api/admin/orders/:orderId`

### Nguyên nhân

Next.js dev server chưa nhận route mới được tạo.

### Giải pháp

1. **Restart Next.js dev server:**

   ```bash
   # Dừng server hiện tại (Ctrl+C)
   # Sau đó chạy lại:
   cd client
   npm run dev
   ```

2. **Xóa cache Next.js:**

   ```bash
   cd client
   rm -rf .next
   npm run dev
   ```

3. **Kiểm tra route đã được tạo đúng:**
   - File: `client/src/app/api/admin/orders/[orderId]/route.ts` ✅
   - File: `client/src/app/api/admin/orders/route.ts` ✅

4. **Test route thủ công:**
   - Mở browser console
   - Gọi: `fetch('/api/admin/orders').then(r => r.json()).then(console.log)`
   - Nếu thành công, route đã hoạt động

### Backend Route đã implement

- `GET /order/admin/:orderId` - Lấy chi tiết đơn hàng (Admin)
- `GET /order` - Lấy danh sách đơn hàng (Admin)
- `PATCH /order/:orderId` - Cập nhật đơn hàng (Admin)

### Frontend Route đã implement

- `GET /api/admin/orders` → Backend `GET /order`
- `GET /api/admin/orders/:orderId` → Backend `GET /order/admin/:orderId`
- `PATCH /api/admin/orders/:orderId` → Backend `PATCH /order/:orderId`

## Kiểm tra Backend

Nếu vẫn lỗi sau khi restart, kiểm tra backend:

```bash
cd server
# Kiểm tra backend có đang chạy không
curl http://localhost:4000/order/admin/YOUR_ORDER_ID
```

Nếu backend trả về 404, có thể cần restart backend server.
