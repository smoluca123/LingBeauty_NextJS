# Wishlist Mutation Optimization Analysis

## 📊 Tổng quan

Document này phân tích và tối ưu wishlist mutations, chuyển từ `invalidateQueries` sang `setQueriesData` để cải thiện UX với instant updates.

---

## 🎯 Các Mutations Đã Tối Ưu

### 1. **useAddToWishlist** - ✅ Đã tốt, cải thiện thêm

**Trước:**

```typescript
onSuccess: (response, variables) => {
  queryClient.setQueryData(wishlistKeys.status(...), ...)
  queryClient.invalidateQueries({ queryKey: wishlistKeys.list() }) // ❌ Fetch lại
}
```

**Sau:**

```typescript
onSuccess: (response, variables) => {
  // Update status
  queryClient.setQueryData(wishlistKeys.status(...), ...)

  // ✅ Add to infinite query immediately
  queryClient.setQueriesData<IInfiniteWishlistData>(
    { predicate: (query) => ... },
    (oldData) => {
      // Add to first page
      newPages[0].data.items = [response.data, ...items]
      newPages[0].data.totalCount += 1
    }
  )
}
```

**Lợi ích:**

- ⚡ Item xuất hiện NGAY trong list
- 🎯 Không cần fetch lại
- ✅ Optimistic update hoàn chỉnh

---

### 2. **useUpdateWishlistItem** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: (response) => {
  queryClient.invalidateQueries({ queryKey: wishlistKeys.all }) // ❌ Fetch tất cả
}
```

**Sau:**

```typescript
onSuccess: (response) => {
  const updatedItem = response.data

  // ✅ Update in-place trong infinite query
  queryClient.setQueriesData<IInfiniteWishlistData>(
    { predicate: (query) => ... },
    (oldData) => ({
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          items: page.data.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        },
      })),
    })
  )
}
```

**Lợi ích:**

- ⚡ Note update INSTANT
- 🎯 Không fetch lại
- ✅ Update across all pages

---

### 3. **useRemoveFromWishlist** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: (response, variables) => {
  queryClient.setQueryData(wishlistKeys.status(...), ...)
  queryClient.invalidateQueries({ queryKey: wishlistKeys.list() }) // ❌ Fetch lại
}
```

**Sau:**

```typescript
onSuccess: (response, variables, context) => {
  // Update status
  queryClient.setQueryData(wishlistKeys.status(...), ...)

  // ✅ Remove from infinite query immediately
  queryClient.setQueriesData<IInfiniteWishlistData>(
    { predicate: (query) => ... },
    (oldData) => ({
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          items: page.data.items.filter((item) => item.id !== context.itemId),
          totalCount: Math.max(0, page.data.totalCount - 1),
        },
      })),
    })
  )
}
```

**Lợi ích:**

- ⚡ Item biến mất NGAY
- 🎯 Không fetch lại
- ✅ Optimistic + confirmed update

---

### 4. **useClearWishlist** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: (response) => {
  queryClient.invalidateQueries({ queryKey: wishlistKeys.all }) // ❌ Fetch tất cả
}
```

**Sau:**

```typescript
onSuccess: (response) => {
  // ✅ Clear infinite query data
  queryClient.setQueriesData<IInfiniteWishlistData>(
    { predicate: (query) => ... },
    (oldData) => ({
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          items: [],
          totalCount: 0,
        },
      })),
    })
  )

  // ✅ Clear all status queries
  queryClient.setQueriesData<IApiResponseWrapperType<IWishlistStatusResponse>>(
    { predicate: (query) => key[0] === 'wishlist' && key[1] === 'status' },
    (oldData) => ({
      ...oldData,
      data: { isInWishlist: false, wishlistItemId: null },
    })
  )
}
```

**Lợi ích:**

- ⚡ List clear INSTANT
- 🎯 Tất cả status queries được reset
- ✅ Không fetch lại

---

### 5. **useMoveToCart** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: (response) => {
  queryClient.invalidateQueries({ queryKey: wishlistKeys.all }) // ❌ Fetch wishlist
  queryClient.invalidateQueries({ queryKey: ['cart'] }) // ✅ OK - cart cần fetch
}
```

**Sau:**

```typescript
onSuccess: (response, variables) => {
  // ✅ Remove from wishlist immediately
  queryClient.setQueriesData<IInfiniteWishlistData>(
    { predicate: (query) => ... },
    (oldData) => ({
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          items: page.data.items.filter((item) => item.id !== variables.itemId),
          totalCount: Math.max(0, page.data.totalCount - 1),
        },
      })),
    })
  )

  // ✅ Still invalidate cart - different resource
  queryClient.invalidateQueries({ queryKey: ['cart'] })
}
```

**Lợi ích:**

- ⚡ Item biến khỏi wishlist NGAY
- 🎯 Cart fetch để có data mới
- ✅ Hybrid approach tối ưu

---

### 6. **useDeleteSharedWishlist** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: (response) => {
  queryClient.invalidateQueries({ queryKey: wishlistKeys.sharedList() }) // ❌ Fetch lại
}
```

**Sau:**

```typescript
onSuccess: (response, sharedWishlistId) => {
  // ✅ Remove from list immediately
  queryClient.setQueryData<IApiResponseWrapperType<ISharedWishlistType[]>>(
    wishlistKeys.sharedList(),
    (oldData) => {
      if (!oldData?.data) return oldData

      return {
        ...oldData,
        data: oldData.data.filter((item) => item.id !== sharedWishlistId),
      }
    },
  )
}
```

**Lợi ích:**

- ⚡ Shared link biến mất NGAY
- 🎯 Không fetch lại
- ✅ Simple array filter

---

### 7. **useCreateSharedWishlist** - ✅ Giữ nguyên

**Lý do giữ `invalidateQueries`:**

- Server generate `shareToken`, `shareUrl`, `viewCount`
- Không thể predict exact data structure
- User không ở trang list ngay sau khi tạo
- Fetch lại là cách an toàn nhất

---

## 🔑 Key Patterns

### Pattern 1: Infinite Query Updates

```typescript
queryClient.setQueriesData<IInfiniteWishlistData | undefined>(
  {
    predicate: (query) => {
      const key = query.queryKey
      return (
        key[0] === 'wishlist' &&
        key[1] === 'list' &&
        !key.includes('shared') // ← Exclude shared wishlists
      )
    },
  },
  (oldData) => {
    if (!oldData?.pages) return oldData

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          items: /* transform items */,
          totalCount: /* update count */,
        },
      })),
    }
  }
)
```

**Khi nào dùng:**

- ✅ Wishlist dùng `useInfiniteQuery`
- ✅ Cần update across all pages
- ✅ Response data đầy đủ

### Pattern 2: Status Query Updates

```typescript
queryClient.setQueryData(wishlistKeys.status(productId, variantId), {
  data: {
    isInWishlist: true / false,
    wishlistItemId: 'id' / null,
  },
})
```

**Khi nào dùng:**

- ✅ Toggle wishlist button state
- ✅ Optimistic updates
- ✅ Instant UI feedback

### Pattern 3: Bulk Status Clear

```typescript
queryClient.setQueriesData<IApiResponseWrapperType<IWishlistStatusResponse>>(
  {
    predicate: (query) => {
      const key = query.queryKey
      return key[0] === 'wishlist' && key[1] === 'status'
    },
  },
  (oldData) => {
    if (!oldData) return oldData
    return {
      ...oldData,
      data: { isInWishlist: false, wishlistItemId: null },
    }
  },
)
```

**Khi nào dùng:**

- ✅ Clear all wishlist
- ✅ Reset tất cả status queries
- ✅ Đảm bảo consistency

---

## 📊 Performance Comparison

| Mutation        | Trước     | Sau                 | Cải thiện         |
| --------------- | --------- | ------------------- | ----------------- |
| Add to Wishlist | 1 fetch   | 0 fetch             | ⚡ Instant        |
| Update Note     | 1 fetch   | 0 fetch             | ⚡ Instant        |
| Remove Item     | 1 fetch   | 0 fetch             | ⚡ Instant        |
| Clear Wishlist  | 1 fetch   | 0 fetch             | ⚡ Instant        |
| Move to Cart    | 2 fetches | 1 fetch (cart only) | ⚡ 50% faster     |
| Delete Shared   | 1 fetch   | 0 fetch             | ⚡ Instant        |
| Create Shared   | 1 fetch   | 1 fetch             | ✅ Same (correct) |

**Tổng cải thiện:**

- 🎯 6/7 mutations không cần fetch lại
- ⚡ UX cải thiện đáng kể
- ✅ Type-safe với TypeScript
- 💾 Tiết kiệm bandwidth

---

## 🎨 Best Practices Applied

### 1. Type Safety

```typescript
interface IInfiniteWishlistData {
  pages: IApiResponseWrapperType<IWishlistResponseType>[]
  pageParams: number[]
}

queryClient.setQueriesData<IInfiniteWishlistData | undefined>(...)
```

### 2. Null Checks

```typescript
;(oldData) => {
  if (!oldData?.pages) return oldData
  // ... transform
}
```

### 3. Immutable Updates

```typescript
pages: oldData.pages.map((page) => ({
  ...page,
  data: {
    ...page.data,
    items: [...newItems],
  },
}))
```

### 4. Predicate Pattern Matching

```typescript
predicate: (query) => {
  const key = query.queryKey
  return key[0] === 'wishlist' && key[1] === 'list' && !key.includes('shared')
}
```

### 5. Context for Rollback

```typescript
onMutate: async (variables) => {
  const previousStatus = queryClient.getQueryData(...)
  queryClient.setQueryData(...) // Optimistic
  return { previousStatus, itemId: variables.itemId }
},
onError: (error, variables, context) => {
  if (context?.previousStatus) {
    queryClient.setQueryData(..., context.previousStatus) // Rollback
  }
}
```

---

## 🔄 Infinite Query Structure

Wishlist sử dụng `useInfiniteQuery` với structure:

```typescript
{
  pages: [
    {
      data: {
        items: IWishlistItemType[],
        totalCount: number,
        page: number,
        limit: number,
        totalPages: number,
        hasMore: boolean,
      },
      message: string,
      statusCode: number,
      date: Date,
    },
    // ... more pages
  ],
  pageParams: [1, 2, 3, ...]
}
```

**Khi update:**

- ✅ Map qua tất cả pages
- ✅ Transform items trong mỗi page
- ✅ Update totalCount nếu cần
- ✅ Giữ nguyên structure

---

## 📚 Related Files

- `client/src/hooks/mutations/wishlist.mutation.ts` - Implementation
- `client/src/hooks/querys/wishlist.query.ts` - Query keys & hooks
- `client/src/lib/types/interfaces/apis/wishlist.interfaces.ts` - Type definitions
- `client/src/lib/apis/client/wishlist-apis.ts` - API calls

---

## 🎯 Key Takeaways

### Khi nào dùng `setQueriesData` với Infinite Query:

✅ Response data đầy đủ và match structure  
✅ Cần update across all pages  
✅ User ở lại trang hiện tại  
✅ Muốn instant feedback  
✅ Có thể transform data safely

### Khi nào vẫn dùng `invalidateQueries`:

✅ Server-generated data không predict được  
✅ Cần sync với resources khác (cart, orders)  
✅ Data structure phức tạp  
✅ An toàn hơn khi không chắc chắn

### Pattern cho Infinite Query:

```typescript
// ✅ Add item → prepend to first page
newPages[0].data.items = [newItem, ...items]
newPages[0].data.totalCount += 1

// ✅ Update item → map and replace
items: items.map((item) => (item.id === id ? updated : item))

// ✅ Remove item → filter out
items: items.filter((item) => item.id !== id)
totalCount: Math.max(0, totalCount - 1)

// ✅ Clear all → empty arrays
items: []
totalCount: 0
```

---

**Updated:** 2026-04-09  
**Author:** Kiro AI Assistant
