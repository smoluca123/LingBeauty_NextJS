# Review Mutation Optimization Analysis

## 📊 Tổng quan

Document này phân tích và tối ưu review mutations, chuyển từ `invalidateQueries` sang `setQueriesData` với optimistic updates để cải thiện UX.

---

## 🎯 Các Mutations Đã Tối Ưu

### 1. **useCreateReviewMutation** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: getProductReviewsQueryKey(productId),
  })
  queryClient.invalidateQueries({
    queryKey: getProductReviewSummaryQueryKey(productId),
  })
  // ❌ Fetch lại cả 2 queries
}
```

**Sau:**

```typescript
onSuccess: (response) => {
  const newReview = response.data

  // ✅ Add to cache immediately
  queryClient.setQueriesData<
    IApiPaginationResponseWrapperType<IReviewDataType>
  >(
    {
      predicate: (query) => {
        const key = query.queryKey
        return key[0] === 'reviews' && key[1] === productId
      },
    },
    (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        data: {
          ...oldData.data,
          items: [newReview, ...oldData.data.items],
          totalCount: oldData.data.totalCount + 1,
        },
      }
    },
  )

  // ✅ Still invalidate summary - needs recalculation
  queryClient.invalidateQueries({
    queryKey: getProductReviewSummaryQueryKey(productId),
  })
}
```

**Lợi ích:**

- ⚡ Review xuất hiện NGAY trong list
- 🎯 Tiết kiệm 1 network request
- ✅ Summary vẫn được recalculate đúng (rating distribution, average)

**Tại sao vẫn invalidate summary:**

- Summary có logic phức tạp: `averageRating`, `ratingDistribution`
- Server cần recalculate chính xác
- Không thể predict exact values

---

### 2. **useMarkHelpfulMutation** - ⚡ Thêm Optimistic Update

**Trước:**

```typescript
onSuccess: (response) => {
  const { helpfulCount } = response.data
  queryClient.setQueriesData(...) // ❌ Chỉ update sau khi server response
}
```

**Sau:**

```typescript
onMutate: async () => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ predicate: ... })

  // Snapshot previous values
  const previousData = queryClient.getQueriesData({ predicate: ... })

  // ✅ Optimistically update NGAY
  queryClient.setQueriesData(..., (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulCount: review.helpfulCount + 1,
              hasMarked: true,
            }
          : review
      ),
    },
  }))

  return { previousData }
},
onSuccess: (response) => {
  // ✅ Update with real data from server
  const { helpfulCount } = response.data
  queryClient.setQueriesData(..., (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((review) =>
        review.id === reviewId
          ? { ...review, helpfulCount, hasMarked: true }
          : review
      ),
    },
  }))
},
onError: (error, _variables, context) => {
  // ✅ Rollback on error
  if (context?.previousData) {
    context.previousData.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

**Lợi ích:**

- ⚡ Button state thay đổi NGAY LẬP TỨC
- 🎯 Count tăng instant
- ✅ Rollback nếu error
- 💾 Perfect UX

---

### 3. **useUnmarkHelpfulMutation** - ⚡ Thêm Optimistic Update

**Tương tự useMarkHelpfulMutation:**

- ✅ Optimistic update: `helpfulCount - 1`, `hasMarked: false`
- ✅ Confirm với server data
- ✅ Rollback on error

**Lợi ích:**

- ⚡ Button state thay đổi NGAY
- 🎯 Count giảm instant
- ✅ Rollback nếu error

---

### 4. **useDeleteReviewMutation** - ⚡ Tối ưu hoàn toàn

**Trước:**

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: getProductReviewsQueryKey(productId),
  })
  queryClient.invalidateQueries({
    queryKey: getProductReviewSummaryQueryKey(productId),
  })
  queryClient.invalidateQueries({
    queryKey: getPublicReviewByIdQueryKey(reviewId),
  })
  // ❌ Fetch lại 3 queries
}
```

**Sau:**

```typescript
onSuccess: () => {
  // ✅ Remove from cache immediately
  queryClient.setQueriesData<
    IApiPaginationResponseWrapperType<IReviewDataType>
  >(
    {
      predicate: (query) => {
        const key = query.queryKey
        return key[0] === 'reviews' && key[1] === productId
      },
    },
    (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        data: {
          ...oldData.data,
          items: oldData.data.items.filter((review) => review.id !== reviewId),
          totalCount: Math.max(0, oldData.data.totalCount - 1),
        },
      }
    },
  )

  // ✅ Still invalidate summary - needs recalculation
  queryClient.invalidateQueries({
    queryKey: getProductReviewSummaryQueryKey(productId),
  })

  // ✅ Still invalidate single review query
  queryClient.invalidateQueries({
    queryKey: getPublicReviewByIdQueryKey(reviewId),
  })
}
```

**Lợi ích:**

- ⚡ Review biến mất NGAY khỏi list
- 🎯 Tiết kiệm 1 network request
- ✅ Summary được recalculate
- ✅ Single review query invalidated (nếu user đang xem)

---

### 5. **useUpdateReviewMutation** - ✅ Đã tốt, giữ nguyên

**Implementation hiện tại:**

```typescript
onSuccess: (response, variables) => {
  const updatedReview = response.data

  // ✅ Update in all review list queries
  queryClient.setQueriesData({ predicate: ... }, (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((review) =>
        review.id === reviewId ? { ...review, ...updatedReview } : review
      ),
    },
  }))

  // ✅ Invalidate summary if rating changed
  if (variables.rating !== undefined) {
    queryClient.invalidateQueries({
      queryKey: getProductReviewSummaryQueryKey(productId),
    })
  }

  // ✅ Invalidate single review query
  queryClient.invalidateQueries({
    queryKey: getPublicReviewByIdQueryKey(reviewId),
  })
}
```

**Tại sao đã tốt:**

- ✅ Update list queries immediately
- ✅ Chỉ invalidate summary khi rating thay đổi (smart!)
- ✅ Invalidate single review query để sync

---

### 6. **useCreateReviewReplyMutation** - ✅ Đã tốt, giữ nguyên

**Implementation hiện tại:**

```typescript
onSuccess: (response) => {
  const newReply = response.data

  // ✅ Add to infinite query first page
  queryClient.setQueriesData<InfiniteData<...>>(
    { predicate: ... },
    (oldData) => {
      if (!oldData || !oldData.pages.length) return oldData

      const firstPage = {
        ...oldData.pages[0],
        data: {
          ...oldData.pages[0].data,
          items: [newReply, ...oldData.pages[0].data.items],
        },
      }

      return {
        ...oldData,
        pages: [firstPage, ...oldData.pages.slice(1)],
      }
    }
  )
}
```

**Tại sao đã tốt:**

- ✅ Reply xuất hiện NGAY
- ✅ Prepend to first page (newest first)
- ✅ Infinite query structure preserved

---

### 7. **useUpdateReviewReplyMutation** - ✅ Đã tốt, giữ nguyên

**Implementation hiện tại:**

```typescript
onSuccess: (response) => {
  const updatedReply = response.data

  // ✅ Update across all pages
  queryClient.setQueriesData({ predicate: ... }, (oldData) => {
    if (!oldData || !oldData.pages.length) return oldData

    const updatedPages = oldData.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        items: page.data.items.map((reply) =>
          reply.id === replyId ? { ...reply, ...updatedReply } : reply
        ),
      },
    }))

    return { ...oldData, pages: updatedPages }
  })
}
```

**Tại sao đã tốt:**

- ✅ Update in-place across all pages
- ✅ Không cần biết reply ở page nào
- ✅ Instant update

---

### 8. **useDeleteReviewReplyMutation** - ✅ Đã tốt, giữ nguyên

**Implementation hiện tại:**

```typescript
onSuccess: () => {
  // ✅ Remove from all pages
  queryClient.setQueriesData({ predicate: ... }, (oldData) => {
    if (!oldData || !oldData.pages.length) return oldData

    const updatedPages = oldData.pages.map((page) => {
      const filteredItems = page.data.items.filter((reply) => reply.id !== replyId)
      const wasDeleted = filteredItems.length < page.data.items.length

      return {
        ...page,
        data: {
          ...page.data,
          items: filteredItems,
          // ✅ Only decrease totalCount once (in the page where reply was found)
          totalCount: wasDeleted ? page.data.totalCount - 1 : page.data.totalCount,
        },
      }
    })

    return { ...oldData, pages: updatedPages }
  })
}
```

**Tại sao đã tốt:**

- ✅ Remove across all pages
- ✅ Smart totalCount update (chỉ giảm 1 lần)
- ✅ Instant removal

---

## 🔑 Key Patterns

### Pattern 1: Optimistic Update với Rollback

```typescript
onMutate: async () => {
  // 1. Cancel outgoing refetches
  await queryClient.cancelQueries({ predicate: ... })

  // 2. Snapshot previous values
  const previousData = queryClient.getQueriesData({ predicate: ... })

  // 3. Optimistically update
  queryClient.setQueriesData(..., (oldData) => {
    // Transform data optimistically
  })

  return { previousData }
},
onSuccess: (response) => {
  // 4. Update with real server data
  queryClient.setQueriesData(..., (oldData) => {
    // Update with response.data
  })
},
onError: (error, _variables, context) => {
  // 5. Rollback on error
  if (context?.previousData) {
    context.previousData.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

**Khi nào dùng:**

- ✅ User actions cần instant feedback (like, mark helpful)
- ✅ Có thể predict exact result
- ✅ Muốn UX tốt nhất

### Pattern 2: Hybrid (setQueriesData + invalidateQueries)

```typescript
onSuccess: (response) => {
  // ✅ Update simple data immediately
  queryClient.setQueriesData({ predicate: ... }, (oldData) => {
    // Add/update/remove items
  })

  // ✅ Invalidate complex calculations
  queryClient.invalidateQueries({
    queryKey: getSummaryQueryKey(...),
  })
}
```

**Khi nào dùng:**

- ✅ List data có thể update trực tiếp
- ✅ Summary/stats cần server recalculate
- ✅ Balance giữa UX và accuracy

### Pattern 3: Predicate Pattern Matching

```typescript
queryClient.setQueriesData<IApiPaginationResponseWrapperType<IReviewDataType>>(
  {
    predicate: (query) => {
      const key = query.queryKey
      return key[0] === 'reviews' && key[1] === productId
      // Matches: ['reviews', 'product-123', { page: 1 }]
      //          ['reviews', 'product-123', { page: 2, rating: 5 }]
      //          ['reviews', 'product-123', { sortBy: 'helpfulCount' }]
    },
  },
  (oldData) => {
    /* transform */
  },
)
```

**Khi nào dùng:**

- ✅ Có pagination với nhiều params
- ✅ Có filters/sorting
- ✅ Cần update across all variants

### Pattern 4: Infinite Query Updates

```typescript
// Add to first page
queryClient.setQueriesData<InfiniteData<...>>(
  { predicate: ... },
  (oldData) => {
    if (!oldData || !oldData.pages.length) return oldData

    const firstPage = {
      ...oldData.pages[0],
      data: {
        ...oldData.pages[0].data,
        items: [newItem, ...oldData.pages[0].data.items],
      },
    }

    return {
      ...oldData,
      pages: [firstPage, ...oldData.pages.slice(1)],
    }
  }
)

// Update across all pages
queryClient.setQueriesData<InfiniteData<...>>(
  { predicate: ... },
  (oldData) => {
    if (!oldData || !oldData.pages.length) return oldData

    const updatedPages = oldData.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        items: page.data.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
      },
    }))

    return { ...oldData, pages: updatedPages }
  }
)
```

---

## 📊 Performance Comparison

| Mutation       | Trước            | Sau                    | Cải thiện     |
| -------------- | ---------------- | ---------------------- | ------------- |
| Create Review  | 2 fetches        | 1 fetch (summary only) | ⚡ 50% faster |
| Mark Helpful   | 0 fetch (đã tốt) | 0 fetch + optimistic   | ⚡⚡ Instant  |
| Unmark Helpful | 0 fetch (đã tốt) | 0 fetch + optimistic   | ⚡⚡ Instant  |
| Update Review  | 0 fetch (đã tốt) | 0 fetch (giữ nguyên)   | ✅ Same       |
| Delete Review  | 3 fetches        | 2 fetches              | ⚡ 33% faster |
| Create Reply   | 0 fetch (đã tốt) | 0 fetch (giữ nguyên)   | ✅ Same       |
| Update Reply   | 0 fetch (đã tốt) | 0 fetch (giữ nguyên)   | ✅ Same       |
| Delete Reply   | 0 fetch (đã tốt) | 0 fetch (giữ nguyên)   | ✅ Same       |

**Tổng cải thiện:**

- 🎯 3 mutations được tối ưu thêm
- ⚡ 2 mutations có optimistic updates (instant feedback)
- ✅ 5 mutations đã tốt, giữ nguyên
- 💾 Tiết kiệm bandwidth đáng kể

---

## 🎨 Best Practices Applied

### 1. Optimistic Updates

```typescript
onMutate: async () => {
  await queryClient.cancelQueries({ predicate: ... })
  const previousData = queryClient.getQueriesData({ predicate: ... })
  queryClient.setQueriesData(...) // Optimistic
  return { previousData }
}
```

### 2. Rollback on Error

```typescript
onError: (error, _variables, context) => {
  if (context?.previousData) {
    context.previousData.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

### 3. Smart Invalidation

```typescript
// ✅ Only invalidate when needed
if (variables.rating !== undefined) {
  queryClient.invalidateQueries({
    queryKey: getProductReviewSummaryQueryKey(productId),
  })
}
```

### 4. Type Safety

```typescript
queryClient.setQueriesData<
  IApiPaginationResponseWrapperType<IReviewDataType> | undefined
>({ predicate: ... }, (oldData) => { ... })
```

### 5. Null Checks

```typescript
;(oldData) => {
  if (!oldData) return oldData
  if (!oldData.pages.length) return oldData
  // ... transform
}
```

---

## 🔄 Query Structure

### Regular Pagination

```typescript
{
  data: {
    items: IReviewDataType[],
    totalCount: number,
    currentPage: number,
    pageSize: number,
  },
  message: string,
  statusCode: number,
  date: Date,
}
```

### Infinite Query

```typescript
{
  pages: [
    {
      data: {
        items: IReviewReplyDataType[],
        totalCount: number,
        currentPage: number,
        pageSize: number,
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

---

## 🎯 Key Takeaways

### Khi nào dùng Optimistic Updates:

✅ User actions cần instant feedback (like, vote)  
✅ Có thể predict exact result  
✅ Operation đơn giản (increment, toggle)  
✅ Có thể rollback dễ dàng

### Khi nào dùng Hybrid Approach:

✅ List data đơn giản → setQueriesData  
✅ Summary/stats phức tạp → invalidateQueries  
✅ Balance giữa UX và accuracy  
✅ Server cần recalculate

### Khi nào vẫn dùng invalidateQueries:

✅ Data structure phức tạp  
✅ Server-side calculations (averageRating, distribution)  
✅ Không thể predict exact result  
✅ An toàn hơn

### Pattern cho Review Mutations:

```typescript
// ✅ Create → Add to list + invalidate summary
items: [newReview, ...items]
totalCount: totalCount + 1

// ✅ Update → Map and replace
items: items.map((review) => (review.id === id ? updated : review))

// ✅ Delete → Filter out + invalidate summary
items: items.filter((review) => review.id !== id)
totalCount: Math.max(0, totalCount - 1)

// ✅ Mark helpful → Optimistic + confirm
helpfulCount: helpfulCount + 1
hasMarked: true
```

---

## 📚 Related Files

- `client/src/hooks/mutations/review.mutation.ts` - Implementation
- `client/src/hooks/querys/review.query.ts` - Query keys & hooks
- `client/src/lib/types/interfaces/apis/review.interfaces.ts` - Type definitions
- `client/src/lib/apis/client/review.apis.ts` - API calls

---

**Updated:** 2026-04-09  
**Author:** Kiro AI Assistant
