# Order Mutation Optimization Analysis

## 📊 Tổng quan

Document này phân tích việc sử dụng `invalidateQueries` vs `setQueryData` trong order mutations và giải thích lý do đằng sau mỗi quyết định.

---

## 🎯 Quyết định Implementation

### 1. **useCreateOrderMutation** → Hybrid: `setQueryData` + `invalidateQueries` ⚡✅

**Implementation:**

```typescript
export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (payload: ICreateOrderPayload) => createOrderClientAPI(payload),
    onSuccess: (response) => {
      const orderId = response.data.id

      // ✅ Set detail data immediately - no fetch needed on redirect
      queryClient.setQueryData(orderQueryKeys.detail(orderId), response)

      // ✅ Invalidate lists to refetch with new order
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })

      // ✅ Invalidate cart since items were purchased
      queryClient.invalidateQueries({ queryKey: ['cart'] })

      toast.success('Đặt hàng thành công!')
      router.push(`/profile/orders/${orderId}`) // ← Redirect
    },
  })
}
```

**Tại sao dùng HYBRID approach:**

1. **Response data ĐẦY ĐỦ:**
   - API trả về `IApiResponseWrapperType<IOrderDataType>`
   - Cùng type với `getOrderByIdClientAPI` → data hoàn toàn giống nhau
   - Có đủ: `orderNumber`, `status`, `items`, `payments`, `shippingAddress`, timestamps, etc.

2. **Flow optimization:**

   ```
   User clicks "Đặt hàng"
   → API returns full order data
   → setQueryData(['orders', 'detail', orderId], response) ← Cache ngay!
   → router.push(`/profile/orders/${orderId}`)
   → Detail page mounts
   → useGetOrderByIdQuery(orderId) ← Dùng cached data, KHÔNG fetch!
   → User thấy data NGAY LẬP TỨC ⚡
   ```

3. **Tại sao vẫn invalidate `orderQueryKeys.all`:**
   - Order lists (`my-orders`) cần refetch để hiển thị order mới
   - Không thể dùng `setQueriesData` vì:
     - List trả về `IOrderListItemDataType` (simplified)
     - Create trả về `IOrderDataType` (full detail)
     - Structure khác nhau, không thể map trực tiếp

4. **Tại sao invalidate `cart`:**
   - Items đã được mua → cart cần sync lại
   - Cart có thể có logic phức tạp (stock check, price update)

**Lợi ích:**

- ⚡ Detail page load INSTANT (no loading state)
- 🎯 Tiết kiệm 1 network request
- ✅ Data consistency vẫn được đảm bảo
- 💾 Better UX: User không thấy loading spinner

**Kết luận:** Hybrid approach tối ưu nhất! ⚡✅

---

### 2. **useCancelOrderMutation** → Chuyển sang `setQueriesData` ⚡

**Trước đây (chậm):**

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) })
  // ❌ Phải chờ 2 network requests
}
```

**Sau khi optimize (nhanh):**

```typescript
onSuccess: (response) => {
  // ✅ Update detail query ngay lập tức
  queryClient.setQueryData(orderQueryKeys.detail(orderId), response)

  // ✅ Update tất cả list queries với predicate
  queryClient.setQueriesData<
    IApiPaginationResponseWrapperType<IOrderListItemDataType> | undefined
  >(
    {
      predicate: (query) => {
        const key = query.queryKey
        return key[0] === 'orders' && key[1] === 'my'
      },
    },
    (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        data: {
          ...oldData.data,
          items: oldData.data.items.map((order) =>
            order.id === orderId
              ? { ...order, status: response.data.status }
              : order,
          ),
        },
      }
    },
  )
}
```

**Tại sao NÊN dùng `setQueriesData`:**

1. **Response data đầy đủ:**
   - API trả về full `IOrderDataType` với status đã update
   - Không cần fetch lại từ server

2. **UX tốt hơn:**
   - User thấy status thay đổi NGAY LẬP TỨC
   - Không có loading state
   - Không có delay

3. **Update nhiều queries cùng lúc:**
   - Detail query: `['orders', 'detail', orderId]`
   - List queries: `['orders', 'my', { page: 1 }]`, `['orders', 'my', { page: 2, status: 'PENDING' }]`, etc.
   - Dùng `predicate` để match tất cả variants

4. **Tiết kiệm bandwidth:**
   - Không cần 2 network requests
   - Chỉ dùng data từ response

**Kết luận:** `setQueriesData` tối ưu hơn ⚡

---

## 🔑 Key Takeaways

### Khi nào dùng `invalidateQueries`:

✅ Cần refetch nhiều queries với structure khác nhau (list vs detail)  
✅ Cần sync nhiều resources khác nhau (cart, orders)  
✅ List data có structure khác với mutation response  
✅ Có logic phức tạp cần server recompute

### Khi nào dùng `setQueryData`:

✅ Response data đầy đủ và match với query structure  
✅ User redirect sang trang dùng exact query key đó  
✅ Muốn instant load, no loading state  
✅ Tiết kiệm network request

### Khi nào dùng HYBRID (setQueryData + invalidateQueries):

⚡ **Best of both worlds!**  
✅ Set detail data để trang redirect load instant  
✅ Invalidate lists để refetch với data mới  
✅ Đảm bảo consistency across all queries  
✅ Optimal UX + Performance

### Khi nào dùng `setQueriesData` với predicate:

✅ Chỉ update 1 field đơn giản (status, quantity)  
✅ Response structure match với list items  
✅ Cần update nhiều queries cùng pattern (pagination, filters)  
✅ User ở lại trang hiện tại

---

## 📝 Pattern: Predicate vs QueryKey

### Dùng `queryKey` (specific):

```typescript
// Chỉ update 1 query cụ thể
queryClient.setQueryData(['orders', 'detail', orderId], response)
```

### Dùng `predicate` (pattern matching):

```typescript
// Update TẤT CẢ queries matching pattern
queryClient.setQueriesData(
  {
    predicate: (query) => {
      const key = query.queryKey
      return key[0] === 'orders' && key[1] === 'my'
      // Matches: ['orders', 'my', { page: 1 }]
      //          ['orders', 'my', { page: 2 }]
      //          ['orders', 'my', { status: 'PENDING' }]
      //          etc.
    },
  },
  (oldData) => {
    /* update logic */
  },
)
```

**Khi nào dùng predicate:**

- ✅ Có pagination (nhiều pages)
- ✅ Có filters/sorting (nhiều variants)
- ✅ Không biết chính xác tất cả query params
- ✅ Cần đảm bảo consistency across all queries

---

## 🎨 Best Practices

1. **Type Safety:**

   ```typescript
   queryClient.setQueriesData<
     IApiPaginationResponseWrapperType<IOrderListItemDataType> | undefined
   >(...)
   ```

2. **Null Check:**

   ```typescript
   (oldData) => {
     if (!oldData) return oldData // ← Important!
     return { ...oldData, ... }
   }
   ```

3. **Immutable Updates:**

   ```typescript
   items: oldData.data.items.map((order) =>
     order.id === orderId
       ? { ...order, status: newStatus } // ← Create new object
       : order,
   )
   ```

4. **Response Data Usage:**
   ```typescript
   onSuccess: (response) => {
     // ✅ Use response.data
     queryClient.setQueryData(key, response)
   }
   ```

---

## 📚 Related Files

- `client/src/hooks/mutations/order.mutation.ts` - Implementation
- `client/src/hooks/querys/order.query.ts` - Query keys
- `client/src/hooks/mutations/product-question.mutation.ts` - Similar pattern với predicate
- `client/src/lib/types/interfaces/apis/order.interfaces.ts` - Type definitions

---

**Updated:** 2026-04-09  
**Author:** Kiro AI Assistant
