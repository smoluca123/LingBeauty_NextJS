# Product Question Mutation Optimization Analysis

## 📊 Tổng quan

Document này phân tích và tối ưu product question mutations, thêm optimistic updates để cải thiện UX với instant feedback.

---

## 🎯 Các Mutations Đã Tối Ưu

### 1. **useCreateQuestionMutation** - ✅ Đã tốt, giữ nguyên

**Implementation hiện tại:**

```typescript
onSuccess: (response) => {
  // ✅ Add to product questions immediately
  queryClient.setQueriesData({ predicate: ... }, (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: [response.data, ...oldData.data.items],
      totalCount: oldData.data.totalCount + 1,
    },
  }))

  // ✅ Add to my questions immediately
  queryClient.setQueriesData({ predicate: ... }, (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: [response.data, ...oldData.data.items],
      totalCount: oldData.data.totalCount + 1,
    },
  }))
}
```

**Tại sao đã tốt:**

- ✅ Question xuất hiện NGAY trong cả 2 lists
- ✅ Update 2 queries cùng lúc (product questions + my questions)
- ✅ Không cần fetch lại
- ✅ Dùng predicate để match all variants

**Không cần optimistic update vì:**

- User đang chờ response (có loading state)
- Server cần validate và generate data
- Không phải instant action như like/vote

---

### 2. **useUpdateQuestionMutation** - ⚡ Thêm Optimistic Update

**Trước:**

```typescript
onSuccess: (response) => {
  queryClient.setQueriesData(...) // ❌ Chỉ update sau khi server response
}
```

**Sau:**

```typescript
onMutate: async (variables) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ predicate: ... })

  // Snapshot previous values
  const previousProductQuestions = queryClient.getQueriesData({ predicate: ... })
  const previousMyQuestions = queryClient.getQueriesData({ predicate: ... })

  // ✅ Optimistically update NGAY
  queryClient.setQueriesData(..., (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((q) =>
        q.id === questionId
          ? {
              ...q,
              question: variables.question,
              updatedAt: new Date().toISOString(),
            }
          : q
      ),
    },
  }))

  return { previousProductQuestions, previousMyQuestions }
},
onSuccess: (response) => {
  // ✅ Update with real server data
  queryClient.setQueriesData(..., (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((q) =>
        q.id === questionId ? response.data : q
      ),
    },
  }))
},
onError: (error, _variables, context) => {
  // ✅ Rollback on error
  if (context?.previousProductQuestions) {
    context.previousProductQuestions.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
  if (context?.previousMyQuestions) {
    context.previousMyQuestions.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

**Lợi ích:**

- ⚡ Question text thay đổi NGAY LẬP TỨC
- 🎯 Update cả 2 lists (product questions + my questions)
- ✅ Rollback nếu error
- 💾 Perfect UX cho edit action

---

### 3. **useDeleteQuestionMutation** - ⚡ Thêm Optimistic Update

**Trước:**

```typescript
onSuccess: () => {
  queryClient.setQueriesData(...) // ❌ Chỉ update sau khi server response
}
```

**Sau:**

```typescript
onMutate: async () => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ predicate: ... })

  // Snapshot previous values
  const previousProductQuestions = queryClient.getQueriesData({ predicate: ... })
  const previousMyQuestions = queryClient.getQueriesData({ predicate: ... })

  // ✅ Optimistically remove NGAY
  queryClient.setQueriesData(..., (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.filter((q) => q.id !== questionId),
      totalCount: Math.max(0, oldData.data.totalCount - 1),
    },
  }))

  return { previousProductQuestions, previousMyQuestions }
},
onSuccess: () => {
  toast.success('Câu hỏi đã được xóa!')
},
onError: (error, _variables, context) => {
  // ✅ Rollback on error
  if (context?.previousProductQuestions) {
    context.previousProductQuestions.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
  if (context?.previousMyQuestions) {
    context.previousMyQuestions.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

**Lợi ích:**

- ⚡ Question biến mất NGAY LẬP TỨC
- 🎯 Remove khỏi cả 2 lists
- ✅ Rollback nếu error
- 💾 Instant feedback cho delete action

---

## 🔑 Key Patterns

### Pattern 1: Dual List Updates

Product questions cần update 2 lists cùng lúc:

1. **Product questions list**: `['product-questions', productId, params]`
2. **My questions list**: `['my-questions', params]`

```typescript
// Update product questions
queryClient.setQueriesData({
  predicate: (query) => {
    const key = query.queryKey
    return key[0] === 'product-questions' && key[1] === productId
  }
}, ...)

// Update my questions
queryClient.setQueriesData({
  predicate: (query) => {
    const key = query.queryKey
    return key[0] === 'my-questions'
  }
}, ...)
```

**Tại sao cần 2 lists:**

- Product questions: Hiển thị trên product detail page
- My questions: Hiển thị trên user profile page
- Cùng 1 question xuất hiện ở 2 nơi

### Pattern 2: Optimistic Update với Multiple Snapshots

```typescript
onMutate: async () => {
  // Cancel queries for both lists
  await queryClient.cancelQueries({
    predicate: (query) => {
      const key = query.queryKey
      return (
        (key[0] === 'product-questions' && key[1] === productId) ||
        key[0] === 'my-questions'
      )
    },
  })

  // Snapshot both lists
  const previousProductQuestions = queryClient.getQueriesData({ predicate: ... })
  const previousMyQuestions = queryClient.getQueriesData({ predicate: ... })

  // Update both lists optimistically
  queryClient.setQueriesData({ predicate: ... }, ...)
  queryClient.setQueriesData({ predicate: ... }, ...)

  return { previousProductQuestions, previousMyQuestions }
},
onError: (error, _variables, context) => {
  // Rollback both lists
  if (context?.previousProductQuestions) {
    context.previousProductQuestions.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
  if (context?.previousMyQuestions) {
    context.previousMyQuestions.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data)
    })
  }
}
```

**Tại sao cần snapshot cả 2:**

- Mỗi list có thể có nhiều variants (different params)
- `getQueriesData` trả về array of `[queryKey, data]`
- Rollback cần restore tất cả variants

### Pattern 3: Type-Safe Date Handling

```typescript
// ❌ Wrong - Date object
updatedAt: new Date()

// ✅ Correct - ISO string
updatedAt: new Date().toISOString()
```

**Tại sao:**

- API trả về `updatedAt` as `string` (ISO format)
- TypeScript interface định nghĩa `updatedAt: string`
- Phải match exact type để avoid type errors

---

## 📊 Performance Comparison

| Mutation        | Trước            | Sau                  | Cải thiện    |
| --------------- | ---------------- | -------------------- | ------------ |
| Create Question | 0 fetch (đã tốt) | 0 fetch (giữ nguyên) | ✅ Same      |
| Update Question | 0 fetch (đã tốt) | 0 fetch + optimistic | ⚡⚡ Instant |
| Delete Question | 0 fetch (đã tốt) | 0 fetch + optimistic | ⚡⚡ Instant |

**Tổng cải thiện:**

- 🎯 2/3 mutations có optimistic updates
- ⚡ Update và Delete có instant feedback
- ✅ Create đã tốt, giữ nguyên
- 💾 Rollback mechanism cho error handling
- 🔄 Dual list updates (product + my questions)

---

## 🎨 Best Practices Applied

### 1. Optimistic Updates

```typescript
onMutate: async (variables) => {
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

### 3. Dual List Management

```typescript
// Update both lists in parallel
queryClient.setQueriesData({ predicate: productQuestionsMatch }, ...)
queryClient.setQueriesData({ predicate: myQuestionsMatch }, ...)
```

### 4. Type Safety

```typescript
const previousProductQuestions = queryClient.getQueriesData<
  IApiPaginationResponseWrapperType<IProductQuestion>
>({ predicate: ... })
```

### 5. Predicate Pattern Matching

```typescript
predicate: (query) => {
  const key = query.queryKey
  return key[0] === 'product-questions' && key[1] === productId
  // Matches: ['product-questions', 'product-123', { page: 1 }]
  //          ['product-questions', 'product-123', { page: 2 }]
  //          ['product-questions', 'product-123', { sortBy: 'date' }]
}
```

---

## 🔄 Query Structure

### Product Questions

```typescript
;['product-questions', productId, params][
  // Examples:
  ('product-questions', 'product-123', { page: 1, limit: 10 })
][('product-questions', 'product-123', { page: 2, limit: 10 })][
  ('product-questions', 'product-123', { sortBy: 'createdAt', order: 'desc' })
]
```

### My Questions

```typescript
;['my-questions', params][
  // Examples:
  ('my-questions', { page: 1, limit: 10 })
][('my-questions', { page: 2, limit: 10 })][
  ('my-questions', { status: 'answered' })
]
```

---

## 🎯 Key Takeaways

### Khi nào dùng Optimistic Updates:

✅ User actions cần instant feedback (edit, delete)  
✅ Có thể predict exact result  
✅ Operation đơn giản  
✅ Có thể rollback dễ dàng

### Khi nào KHÔNG dùng Optimistic Updates:

❌ Server cần validate complex logic  
❌ Có loading state rõ ràng (create)  
❌ User đang chờ response  
❌ Data structure phức tạp

### Pattern cho Dual List Updates:

```typescript
// ✅ Create → Add to both lists
items: [newQuestion, ...items]
totalCount: totalCount + 1

// ✅ Update → Map and replace in both lists
items: items.map((q) => (q.id === id ? updated : q))

// ✅ Delete → Filter out from both lists
items: items.filter((q) => q.id !== id)
totalCount: Math.max(0, totalCount - 1)
```

### Rollback Pattern:

```typescript
// ✅ Snapshot multiple lists
const previousList1 = queryClient.getQueriesData({ predicate: ... })
const previousList2 = queryClient.getQueriesData({ predicate: ... })

// ✅ Rollback all lists
if (context?.previousList1) {
  context.previousList1.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data)
  })
}
if (context?.previousList2) {
  context.previousList2.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data)
  })
}
```

---

## 📚 Related Files

- `client/src/hooks/mutations/product-question.mutation.ts` - Implementation
- `client/src/hooks/querys/product-question.query.ts` - Query keys & hooks
- `client/src/lib/types/interfaces/apis/product-question.interfaces.ts` - Type definitions
- `client/src/lib/apis/client/product-question.apis.ts` - API calls

---

## 💡 Lessons Learned

### 1. Type Safety Matters

- `updatedAt` phải là `string` (ISO format), không phải `Date`
- TypeScript sẽ catch type mismatches
- Always check interface definitions

### 2. Dual List Complexity

- Product questions xuất hiện ở 2 nơi
- Cần update cả 2 lists cùng lúc
- Cần snapshot và rollback cả 2

### 3. Predicate Power

- Match all query variants với 1 predicate
- Không cần biết exact params
- Update across all pages/filters

### 4. Optimistic vs Non-Optimistic

- Create: Không cần optimistic (có loading state)
- Update: Cần optimistic (instant feedback)
- Delete: Cần optimistic (instant removal)

---

**Updated:** 2026-04-09  
**Author:** Kiro AI Assistant
