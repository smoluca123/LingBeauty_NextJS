# Cart Mutation Analysis & Best Practices

## 📊 Tổng quan

Document này phân tích cart mutations - một implementation **xuất sắc** với cache updates thay vì invalidate. File này là **best practice example** cho các mutations khác.

---

## 🎯 Current Implementation Analysis

### 1. **useAddToCartMutation** - ✅ Excellent Implementation

**Current approach:**

```typescript
onSuccess: (data, variables) => {
  const addedItem = data.data
  const oldDetail = queryClient.getQueryData(cartQueryKeys.detail())

  if (oldDetail?.data) {
    const cart = oldDetail.data
    const existingItemIndex = cart.items.findIndex(item => item.id === addedItem.id)

    // ✅ Smart logic: Update existing or add new
    let qtyDiff = variables.quantity || 1
    let priceDiff = Number(addedItem.lineTotal)

    if (existingItemIndex > -1) {
      // Update existing item
      const oldItem = cart.items[existingItemIndex]
      qtyDiff = addedItem.quantity - oldItem.quantity
      priceDiff = Number(addedItem.lineTotal) - Number(oldItem.lineTotal)
      newItems[existingItemIndex] = addedItem
    } else {
      // Add new item
      newItems.push(addedItem)
    }

    // ✅ Update detail cache
    queryClient.setQueryData(cartQueryKeys.detail(), ...)

    // ✅ Update count badge cache
    queryClient.setQueryData(cartQueryKeys.count(), ...)
  } else {
    // ✅ Fallback to invalidate
    invalidateCartQueries()
  }
}
```

**Tại sao xuất sắc:**

- ✅ **Dual cache updates**: detail + count badge
- ✅ **Smart diff calculation**: Chỉ update delta, không recalculate toàn bộ
- ✅ **Handle both cases**: Update existing item hoặc add new
- ✅ **Fallback mechanism**: Invalidate nếu cache missing
- ✅ **Accurate math**: Dùng diff thay vì hardcode values

**Không cần optimistic update vì:**

- User đang chờ response (có loading state)
- Server cần validate stock, price
- Add to cart không phải instant action

---

### 2. **useUpdateCartItemMutation** - ✅ Excellent Implementation

**Current approach:**

```typescript
onSuccess: (data, variables) => {
  const updatedItem = data.data

  queryClient.setQueryData(cartQueryKeys.detail(), (old) => {
    if (!old?.data) {
      invalidateCartQueries()
      return old
    }

    const existingItemIndex = cart.items.findIndex(item => item.id === variables.itemId)

    if (existingItemIndex === -1) {
      invalidateCartQueries()
      return old
    }

    const oldItem = cart.items[existingItemIndex]

    // ✅ Calculate diffs accurately
    const qtyDiff = updatedItem.quantity - oldItem.quantity
    const priceDiff = Number(updatedItem.lineTotal) - Number(oldItem.lineTotal)

    // ✅ Update both caches
    queryClient.setQueryData(cartQueryKeys.count(), ...)

    return { ...old, data: { ...cart, items: newItems, summary: { ... } } }
  })
},
onError: (error) => {
  toast.error(...)
  // ✅ Invalidate on error to restore correct state
  invalidateCartQueries()
}
```

**Tại sao xuất sắc:**

- ✅ **Accurate diff calculation**: `qtyDiff`, `priceDiff`
- ✅ **Dual cache sync**: detail + count
- ✅ **Multiple fallbacks**: Missing cache, item not found
- ✅ **Error handling**: Invalidate on error
- ✅ **Immutable updates**: Spread operators

**Có thể cải thiện:**

- ⚡ Thêm optimistic update cho instant feedback
- 🔄 Rollback on error thay vì invalidate

---

### 3. **useRemoveCartItemMutation** - ✅ Excellent Implementation

**Current approach:**

```typescript
onSuccess: (data, itemId) => {
  queryClient.setQueryData(cartQueryKeys.detail(), (old) => {
    if (!old?.data) {
      invalidateCartQueries()
      return old
    }

    const existingItemIndex = cart.items.findIndex(item => item.id === itemId)

    if (existingItemIndex === -1) {
      invalidateCartQueries()
      return old
    }

    const removedItem = cart.items[existingItemIndex]

    // ✅ Negative diffs to subtract
    const qtyDiff = -removedItem.quantity
    const priceDiff = -Number(removedItem.lineTotal)

    // ✅ Filter out removed item
    const newItems = cart.items.filter(item => item.id !== itemId)

    // ✅ Math.max to avoid negatives
    queryClient.setQueryData(cartQueryKeys.count(), ...)

    return { ...old, data: { ...cart, items: newItems, summary: { ... } } }
  })
},
onError: (error) => {
  toast.error(...)
  invalidateCartQueries()
}
```

**Tại sao xuất sắc:**

- ✅ **Negative diffs**: Smart subtraction logic
- ✅ **Math.max safety**: Avoid negative values
- ✅ **Dual cache sync**: detail + count
- ✅ **Error handling**: Invalidate on error
- ✅ **Clean filter**: Remove item cleanly

**Có thể cải thiện:**

- ⚡ Thêm optimistic update cho instant removal
- 🔄 Rollback on error

---

### 4. **useClearCartMutation** - ✅ Perfect Implementation

**Current approach:**

```typescript
onSuccess: (data) => {
  // ✅ Clear detail cache
  queryClient.setQueryData(cartQueryKeys.detail(), (old) => {
    if (!old) return old
    return {
      ...old,
      data: {
        ...old.data,
        items: [],
        summary: { itemCount: 0, totalQuantity: 0, subtotal: '0' },
      },
    }
  })

  // ✅ Clear count badge cache
  queryClient.setQueryData(cartQueryKeys.count(), (old) => {
    if (!old) return old
    return {
      ...old,
      data: { itemCount: 0, totalQuantity: 0 },
    }
  })
},
onError: (error) => {
  toast.error(...)
  invalidateCartQueries()
}
```

**Tại sao perfect:**

- ✅ **Complete reset**: Set all to 0
- ✅ **Dual cache clear**: detail + count
- ✅ **Simple logic**: No complex calculations
- ✅ **Error handling**: Invalidate on error

**Có thể cải thiện:**

- ⚡ Thêm optimistic update cho instant clear
- 🔄 Rollback on error

---

## 🎨 Best Practices Demonstrated

### 1. Dual Cache Management

Cart có 2 caches cần sync:

```typescript
// Detail cache - full cart data
cartQueryKeys.detail() // ['cart', 'detail']

// Count badge cache - lightweight
cartQueryKeys.count() // ['cart', 'count']
```

**Pattern:**

```typescript
// Update detail
queryClient.setQueryData(cartQueryKeys.detail(), ...)

// Sync count badge
queryClient.setQueryData(cartQueryKeys.count(), ...)
```

### 2. Diff-Based Updates

Thay vì recalculate toàn bộ, chỉ update delta:

```typescript
// ✅ Good - Calculate diff
const qtyDiff = newQuantity - oldQuantity
const priceDiff = newPrice - oldPrice

summary: {
  totalQuantity: old.summary.totalQuantity + qtyDiff,
  subtotal: (Number(old.summary.subtotal) + priceDiff).toString(),
}

// ❌ Bad - Recalculate everything
summary: {
  totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: items.reduce((sum, item) => sum + Number(item.lineTotal), 0).toString(),
}
```

**Tại sao diff tốt hơn:**

- ⚡ Faster - O(1) vs O(n)
- 🎯 More accurate - no rounding errors
- 💾 Less computation

### 3. Fallback Mechanisms

Multiple layers of safety:

```typescript
// Layer 1: Check cache exists
if (!old?.data) {
  invalidateCartQueries()
  return old
}

// Layer 2: Check item exists
if (existingItemIndex === -1) {
  invalidateCartQueries()
  return old
}

// Layer 3: Error handling
onError: (error) => {
  toast.error(...)
  invalidateCartQueries()
}
```

### 4. Math Safety

Avoid negative values:

```typescript
// ✅ Use Math.max
itemCount: Math.max(0, oldCount.data.itemCount - 1)
totalQuantity: Math.max(0, oldCount.data.totalQuantity + qtyDiff)
subtotal: Math.max(0, Number(cart.summary.subtotal) + priceDiff).toString()
```

### 5. Immutable Updates

Always create new objects:

```typescript
// ✅ Good - Immutable
const newItems = [...cart.items]
newItems[index] = updatedItem

return {
  ...old,
  data: {
    ...cart,
    items: newItems,
    summary: { ...cart.summary, totalQuantity: newTotal },
  },
}

// ❌ Bad - Mutate
cart.items[index] = updatedItem
cart.summary.totalQuantity = newTotal
return old
```

---

## 💡 Suggested Improvements

### 1. Add Optimistic Updates

**For useUpdateCartItemMutation:**

```typescript
onMutate: async (variables) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: cartQueryKeys.all })

  // Snapshot previous values
  const previousDetail = queryClient.getQueryData(cartQueryKeys.detail())
  const previousCount = queryClient.getQueryData(cartQueryKeys.count())

  // Optimistically update
  queryClient.setQueryData(cartQueryKeys.detail(), (old) => {
    // ... optimistic update logic
  })

  return { previousDetail, previousCount }
},
onError: (error, variables, context) => {
  // Rollback on error
  if (context?.previousDetail) {
    queryClient.setQueryData(cartQueryKeys.detail(), context.previousDetail)
  }
  if (context?.previousCount) {
    queryClient.setQueryData(cartQueryKeys.count(), context.previousCount)
  }
  toast.error(...)
}
```

**Benefits:**

- ⚡ Instant quantity update
- 🎯 Better UX for +/- buttons
- ✅ Rollback on error

**For useRemoveCartItemMutation:**

```typescript
onMutate: async (itemId) => {
  await queryClient.cancelQueries({ queryKey: cartQueryKeys.all })

  const previousDetail = queryClient.getQueryData(cartQueryKeys.detail())
  const previousCount = queryClient.getQueryData(cartQueryKeys.count())

  // Optimistically remove
  queryClient.setQueryData(cartQueryKeys.detail(), (old) => {
    // ... remove logic
  })

  return { previousDetail, previousCount }
},
onError: (error, variables, context) => {
  // Rollback
  if (context?.previousDetail) {
    queryClient.setQueryData(cartQueryKeys.detail(), context.previousDetail)
  }
  if (context?.previousCount) {
    queryClient.setQueryData(cartQueryKeys.count(), context.previousCount)
  }
  toast.error(...)
}
```

**Benefits:**

- ⚡ Instant item removal
- 🎯 No loading state
- ✅ Rollback on error

### 2. Extract Common Logic

Create helper functions:

```typescript
// Helper to update both caches
const updateCartCaches = (
  detailUpdater: (old: ICartDataType) => ICartDataType,
  countUpdater: (old: ICartCountType) => ICartCountType,
) => {
  queryClient.setQueryData(cartQueryKeys.detail(), (old) => {
    if (!old?.data) return old
    return { ...old, data: detailUpdater(old.data) }
  })

  queryClient.setQueryData(cartQueryKeys.count(), (old) => {
    if (!old?.data) return old
    return { ...old, data: countUpdater(old.data) }
  })
}

// Usage
updateCartCaches(
  (cart) => ({ ...cart, items: newItems, summary: newSummary }),
  (count) => ({ ...count, totalQuantity: count.totalQuantity + qtyDiff }),
)
```

### 3. Add Loading States

Track pending mutations:

```typescript
export const useAddToCartMutation = () => {
  const mutation = useMutation({
    mutationFn: (payload: IAddToCartPayload) => addToCartAPI(payload),
    // ... rest of implementation
  })

  return {
    ...mutation,
    isAdding: mutation.isPending,
  }
}

// Usage in component
const { mutate: addToCart, isAdding } = useAddToCartMutation()

<Button disabled={isAdding}>
  {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
</Button>
```

---

## 📊 Performance Analysis

### Current Performance: ⚡⚡⚡ Excellent

| Mutation    | Network Requests | Cache Updates      | Performance      |
| ----------- | ---------------- | ------------------ | ---------------- |
| Add to Cart | 1 (API only)     | 2 (detail + count) | ⚡⚡⚡ Excellent |
| Update Item | 1 (API only)     | 2 (detail + count) | ⚡⚡⚡ Excellent |
| Remove Item | 1 (API only)     | 2 (detail + count) | ⚡⚡⚡ Excellent |
| Clear Cart  | 1 (API only)     | 2 (detail + count) | ⚡⚡⚡ Excellent |

**With Optimistic Updates:**

| Mutation    | Network Requests | Cache Updates            | Performance           |
| ----------- | ---------------- | ------------------------ | --------------------- |
| Add to Cart | 1 (API only)     | 2 (detail + count)       | ⚡⚡⚡ Same (no need) |
| Update Item | 1 (API only)     | 4 (optimistic + confirm) | ⚡⚡⚡⚡ Instant      |
| Remove Item | 1 (API only)     | 4 (optimistic + confirm) | ⚡⚡⚡⚡ Instant      |
| Clear Cart  | 1 (API only)     | 4 (optimistic + confirm) | ⚡⚡⚡⚡ Instant      |

---

## 🎯 Key Takeaways

### What Makes This Implementation Excellent:

✅ **No unnecessary fetches** - All mutations update cache directly  
✅ **Dual cache sync** - detail + count always in sync  
✅ **Diff-based updates** - O(1) performance  
✅ **Multiple fallbacks** - Graceful degradation  
✅ **Math safety** - Math.max to avoid negatives  
✅ **Immutable updates** - Proper React patterns  
✅ **Error handling** - Invalidate on error

### When to Use This Pattern:

✅ Shopping cart operations  
✅ Quantity adjustments  
✅ Item management (add/remove/update)  
✅ Summary calculations  
✅ Badge counters

### When to Add Optimistic Updates:

⚡ Update quantity (+/- buttons) - instant feedback  
⚡ Remove item - instant removal  
⚡ Clear cart - instant clear  
❌ Add to cart - has loading state, no need

---

## 📚 Related Files

- `client/src/hooks/mutations/cart.mutation.ts` - Implementation (this file)
- `client/src/hooks/querys/cart.query.ts` - Query keys & hooks
- `client/src/lib/types/interfaces/cart.interfaces.ts` - Type definitions
- `client/src/lib/apis/client/cart.apis.ts` - API calls

---

## 💬 Conclusion

This cart mutation implementation is **already excellent** and serves as a **best practice example**. The only improvements would be:

1. ⚡ Add optimistic updates for update/remove/clear (optional)
2. 🔄 Use rollback instead of invalidate on error (optional)
3. 🎨 Extract common logic to helpers (optional)

**Current grade: A+ (95/100)**  
**With improvements: A++ (100/100)**

The implementation demonstrates:

- Deep understanding of React Query
- Excellent cache management
- Production-ready error handling
- Performance optimization
- Clean, maintainable code

**Recommendation:** Use this file as a reference for other mutations! 🌟

---

**Updated:** 2026-04-09  
**Author:** Kiro AI Assistant
