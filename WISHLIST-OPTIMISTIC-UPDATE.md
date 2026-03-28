# Wishlist Optimistic Updates

## Tổng quan

Đã cập nhật wishlist để sử dụng **optimistic updates** với `useTransition`, giúp UI phản hồi ngay lập tức thay vì phải đợi API hoàn thành.

## Các thay đổi chính

### 1. Hook Mutations (`client/src/hooks/mutations/wishlist.mutation.ts`)

#### `useAddToWishlist`

- Thêm `onMutate`: Cập nhật cache ngay lập tức trước khi gọi API
- Lưu snapshot của state cũ để rollback nếu có lỗi
- `onSuccess`: Cập nhật với dữ liệu thật từ server
- `onError`: Rollback về state cũ nếu API thất bại

```typescript
onMutate: async (variables) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({
    queryKey: wishlistKeys.status(variables.productId, variables.variantId),
  })

  // Snapshot previous value
  const previousStatus = queryClient.getQueryData(
    wishlistKeys.status(variables.productId, variables.variantId),
  )

  // Optimistically update to the new value
  queryClient.setQueryData(
    wishlistKeys.status(variables.productId, variables.variantId),
    {
      data: {
        isInWishlist: true,
        wishlistItemId: 'temp-id',
      },
    },
  )

  return { previousStatus }
}
```

#### `useRemoveFromWishlist`

- Thay đổi signature: Nhận object `{ itemId, productId, variantId }` thay vì chỉ `itemId`
- Thêm optimistic update tương tự như `useAddToWishlist`
- Cập nhật `isInWishlist: false` ngay lập tức

### 2. Component (`client/src/components/wishlist/add-to-wishlist-button.tsx`)

#### Sử dụng `useTransition`

```typescript
const [isPending, startTransition] = useTransition()

const handleToggle = (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  setIsAnimating(true)
  setTimeout(() => setIsAnimating(false), 300)

  startTransition(() => {
    if (isInWishlist && wishlistItemId) {
      removeFromWishlist.mutate({
        itemId: wishlistItemId,
        productId,
        variantId,
      })
    } else {
      addToWishlist.mutate({
        productId,
        variantId,
      })
    }
  })
}
```

#### Loading state

```typescript
const isLoading =
  isPending || addToWishlist.isPending || removeFromWishlist.isPending
```

## Lợi ích

1. **UI phản hồi ngay lập tức**: Người dùng thấy thay đổi ngay khi click, không cần đợi API
2. **Không cần refetch**: Cập nhật cache trực tiếp thay vì invalidate và fetch lại
3. **Error handling tốt hơn**: Tự động rollback nếu API thất bại
4. **UX mượt mà hơn**: Kết hợp với animation để tạo cảm giác responsive

## Cách hoạt động

1. User click vào nút wishlist
2. `startTransition` được gọi → UI cập nhật ngay lập tức (optimistic)
3. Mutation được trigger → Gọi API ở background
4. Nếu thành công: Cập nhật với dữ liệu thật từ server
5. Nếu thất bại: Rollback về state cũ và hiển thị toast error

## Testing

Để test optimistic updates:

1. Throttle network trong DevTools (Slow 3G)
2. Click vào nút wishlist
3. Quan sát UI cập nhật ngay lập tức
4. Đợi API hoàn thành để xác nhận

## Notes

- Chỉ invalidate `wishlistKeys.list()` để refresh counts, không invalidate status query
- Sử dụng `setQueryData` để cập nhật cache trực tiếp
- `useTransition` giúp React biết đây là non-urgent update
