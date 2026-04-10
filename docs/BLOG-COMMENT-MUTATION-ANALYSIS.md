# Blog Comment Mutation Analysis - Excellent Implementation

## 📊 Tổng quan

Document này phân tích blog comment mutations - một implementation **xuất sắc** với infinite query updates và smart comment type detection. File này là **best practice example** cho nested comments.

---

## 🎯 Current Implementation Analysis

### 1. **useCreateBlogCommentMutation** - ✅ Excellent with Smart Logic

**Current approach:**

```typescript
onSuccess: (response) => {
  const newComment = response.data

  queryClient.setQueriesData<InfiniteData<...>>(
    {
      predicate: (query) => {
        const key = query.queryKey
        // ✅ Smart matching: Only match queries for this post
        if (key[0] === 'blog-comments' && key[1] === 'infinite' && key[2]) {
          const params = key[2] as Record<string, unknown>
          return params.postId === postId
        }
        return false
      },
    },
    (oldData) => {
      if (!oldData || !oldData.pages.length) return oldData

      // ✅ Smart detection: Determine if top-level or reply
      const isTopLevel = !newComment.parentId
      const firstPageItems = oldData.pages[0]?.data.items
      const targetParentId = firstPageItems?.[0]?.parentId

      // ✅ Only update if query matches comment type
      if (isTopLevel && targetParentId === undefined) {
        // Add to top-level comments
      } else if (!isTopLevel && targetParentId === newComment.parentId) {
        // Add to replies
      }

      return oldData
    }
  )
}
```

**Tại sao xuất sắc:**

- ✅ **Smart predicate**: Match exact post + query type
- ✅ **Type detection**: Distinguish top-level vs replies
- ✅ **Conditional update**: Only update matching queries
- ✅ **Prepend to first page**: Newest first
- ✅ **Update totalCount**: Accurate count
- ✅ **No unnecessary fetches**: 0 network requests

**Pattern đặc biệt:**

```typescript
// Query structure for nested comments:
;['blog-comments', 'infinite', { postId: 'post-123' }][ // Top-level
  ('blog-comments', 'infinite', { postId: 'post-123', parentId: 'comment-456' })
] // Replies
```

**Không cần optimistic update vì:**

- User đang chờ response (có loading state)
- Server cần validate, sanitize content
- Comment creation không phải instant action

---

### 2. **useUpdateBlogCommentMutation** - ✅ Excellent Implementation

**Current approach:**

```typescript
onSuccess: (response, variables) => {
  const updatedComment = response.data

  // ✅ Update across ALL pages in ALL infinite queries
  queryClient.setQueriesData<InfiniteData<...>>(
    {
      predicate: (query) => {
        const key = query.queryKey
        return key[0] === 'blog-comments' && key[1] === 'infinite'
      },
    },
    (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.map((comment) =>
              comment.id === variables.id ? updatedComment : comment
            ),
          },
        })),
      }
    }
  )
}
```

**Tại sao xuất sắc:**

- ✅ **Update all queries**: Top-level + all reply threads
- ✅ **Update all pages**: Across pagination
- ✅ **In-place update**: Map and replace
- ✅ **No fetch needed**: 0 network requests
- ✅ **Immutable updates**: Proper React patterns

**Có thể cải thiện:**

- ⚡ Thêm optimistic update cho instant feedback

---

### 3. **useDeleteBlogCommentMutation** - ✅ Excellent Implementation

**Current approach:**

```typescript
onSuccess: (_, commentId) => {
  // ✅ Remove from ALL pages in ALL infinite queries
  queryClient.setQueriesData<InfiniteData<...>>(
    {
      predicate: (query) => {
        const key = query.queryKey
        return key[0] === 'blog-comments' && key[1] === 'infinite'
      },
    },
    (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.filter((comment) => comment.id !== commentId),
            totalCount: Math.max(0, page.data.totalCount - 1),
          },
        })),
      }
    }
  )
}
```

**Tại sao xuất sắc:**

- ✅ **Remove from all queries**: Top-level + all reply threads
- ✅ **Remove from all pages**: Across pagination
- ✅ **Update totalCount**: Accurate count
- ✅ **Math.max safety**: Avoid negatives
- ✅ **No fetch needed**: 0 network requests

**Có thể cải thiện:**

- ⚡ Thêm optimistic update cho instant removal

---

### 4. **useReportBlogCommentMutation** - ✅ Perfect Implementation

**Current approach:**

```typescript
onSuccess: () => {
  toast.success('Báo cáo bình luận thành công')
  // ✅ No cache update needed - report doesn't change UI
}
```

**Tại sao perfect:**

- ✅ **No cache update**: Report không thay đổi UI
- ✅ **Simple toast**: User feedback
- ✅ **Clean logic**: Không làm gì thừa

---

## 🎨 Best Practices Demonstrated

### 1. Smart Predicate Matching

**Match specific post:**

```typescript
predicate: (query) => {
  const key = query.queryKey
  if (key[0] === 'blog-comments' && key[1] === 'infinite' && key[2]) {
    const params = key[2] as Record<string, unknown>
    return params.postId === postId // ✅ Match exact post
  }
  return false
}
```

**Match all queries:**

```typescript
predicate: (query) => {
  const key = query.queryKey
  return key[0] === 'blog-comments' && key[1] === 'infinite'
  // ✅ Match all posts, all comment types
}
```

### 2. Comment Type Detection

```typescript
const isTopLevel = !newComment.parentId
const firstPageItems = oldData.pages[0]?.data.items
const targetParentId = firstPageItems?.[0]?.parentId

// ✅ Smart logic to determine query type
if (isTopLevel && targetParentId === undefined) {
  // This is a top-level comments query
} else if (!isTopLevel && targetParentId === newComment.parentId) {
  // This is a replies query for the correct parent
}
```

**Tại sao cần:**

- Top-level comments và replies có separate infinite queries
- Cần update đúng query type
- Tránh add reply vào top-level query (và ngược lại)

### 3. Infinite Query Updates

**Add to first page:**

```typescript
const firstPage = {
  ...oldData.pages[0],
  data: {
    ...oldData.pages[0].data,
    items: [newComment, ...oldData.pages[0].data.items],
    totalCount: oldData.pages[0].data.totalCount + 1,
  },
}

return {
  ...oldData,
  pages: [firstPage, ...oldData.pages.slice(1)],
}
```

**Update across all pages:**

```typescript
return {
  ...oldData,
  pages: oldData.pages.map((page) => ({
    ...page,
    data: {
      ...page.data,
      items: page.data.items.map((comment) =>
        comment.id === id ? updatedComment : comment,
      ),
    },
  })),
}
```

**Remove from all pages:**

```typescript
return {
  ...oldData,
  pages: oldData.pages.map((page) => ({
    ...page,
    data: {
      ...page.data,
      items: page.data.items.filter((comment) => comment.id !== id),
      totalCount: Math.max(0, page.data.totalCount - 1),
    },
  })),
}
```

### 4. Nested Comments Structure

```typescript
interface IBlogCommentDataType {
  id: string
  postId: string
  parentId: string | null // ✅ null = top-level, string = reply
  content: string
  userId: string
  createdAt: string
  updatedAt: string
}

// Query keys:
;['blog-comments', 'infinite', { postId: 'post-123' }][ // Top-level
  ('blog-comments', 'infinite', { postId: 'post-123', parentId: 'comment-456' })
] // Replies
```

---

## 💡 Suggested Improvements

### 1. Add Optimistic Updates for Update

```typescript
export const useUpdateBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: IUpdateBlogCommentPayload
    }) => updateBlogCommentClientAPI(id, data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-comments' && key[1] === 'infinite'
        },
      })

      // Snapshot previous values
      const previousData = queryClient.getQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-comments' && key[1] === 'infinite'
        },
      })

      // Optimistically update
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((comment) =>
                  comment.id === variables.id
                    ? {
                        ...comment,
                        content: variables.data.content,
                        updatedAt: new Date().toISOString(),
                      }
                    : comment,
                ),
              },
            })),
          }
        },
      )

      return { previousData }
    },
    onSuccess: (response, variables) => {
      const updatedComment = response.data

      // Update with real server data
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((comment) =>
                  comment.id === variables.id ? updatedComment : comment,
                ),
              },
            })),
          }
        },
      )

      toast.success('Cập nhật bình luận thành công')
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật bình luận thất bại',
      )
    },
  })
}
```

**Benefits:**

- ⚡ Comment text thay đổi NGAY LẬP TỨC
- 🎯 No loading state
- ✅ Rollback on error

### 2. Add Optimistic Updates for Delete

```typescript
export const useDeleteBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogCommentClientAPI(id),
    onMutate: async (commentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-comments' && key[1] === 'infinite'
        },
      })

      // Snapshot previous values
      const previousData = queryClient.getQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >({
        predicate: (query) => {
          const key = query.queryKey
          return key[0] === 'blog-comments' && key[1] === 'infinite'
        },
      })

      // Optimistically remove
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (comment) => comment.id !== commentId,
                ),
                totalCount: Math.max(0, page.data.totalCount - 1),
              },
            })),
          }
        },
      )

      return { previousData }
    },
    onSuccess: () => {
      toast.success('Xóa bình luận thành công')
    },
    onError: (error, _commentId, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(
        error instanceof Error ? error.message : 'Xóa bình luận thất bại',
      )
    },
  })
}
```

**Benefits:**

- ⚡ Comment biến mất NGAY LẬP TỨC
- 🎯 No loading state
- ✅ Rollback on error

---

## 📊 Performance Analysis

### Current Performance: ⚡⚡⚡ Excellent

| Mutation       | Network Requests | Cache Updates      | Performance      |
| -------------- | ---------------- | ------------------ | ---------------- |
| Create Comment | 1 (API only)     | 1 (specific query) | ⚡⚡⚡ Excellent |
| Update Comment | 1 (API only)     | N (all queries)    | ⚡⚡⚡ Excellent |
| Delete Comment | 1 (API only)     | N (all queries)    | ⚡⚡⚡ Excellent |
| Report Comment | 1 (API only)     | 0 (no update)      | ⚡⚡⚡ Perfect   |

**With Optimistic Updates:**

| Mutation       | Network Requests | Cache Updates             | Performance           |
| -------------- | ---------------- | ------------------------- | --------------------- |
| Create Comment | 1 (API only)     | 1 (specific query)        | ⚡⚡⚡ Same (no need) |
| Update Comment | 1 (API only)     | 2N (optimistic + confirm) | ⚡⚡⚡⚡ Instant      |
| Delete Comment | 1 (API only)     | 2N (optimistic + confirm) | ⚡⚡⚡⚡ Instant      |
| Report Comment | 1 (API only)     | 0 (no update)             | ⚡⚡⚡ Same           |

---

## 🎯 Key Takeaways

### What Makes This Implementation Excellent:

✅ **No unnecessary fetches** - All mutations update cache directly  
✅ **Smart predicate matching** - Match exact queries needed  
✅ **Comment type detection** - Distinguish top-level vs replies  
✅ **Conditional updates** - Only update matching queries  
✅ **Infinite query mastery** - Perfect pagination handling  
✅ **Immutable updates** - Proper React patterns  
✅ **Math safety** - Math.max to avoid negatives

### When to Use This Pattern:

✅ Nested comments (top-level + replies)  
✅ Infinite scroll pagination  
✅ Multiple query variants (different filters)  
✅ Real-time updates across queries  
✅ Comment threads

### When to Add Optimistic Updates:

⚡ Update comment - instant text change  
⚡ Delete comment - instant removal  
❌ Create comment - has loading state, no need  
❌ Report comment - no UI change, no need

---

## 🌟 Advanced Patterns

### Pattern 1: Nested Comment Queries

```typescript
// Top-level comments
;['blog-comments', 'infinite', { postId: 'post-123' }][
  // Replies to a specific comment
  ('blog-comments', 'infinite', { postId: 'post-123', parentId: 'comment-456' })
]

// Smart detection in predicate
predicate: (query) => {
  const key = query.queryKey
  if (key[0] === 'blog-comments' && key[1] === 'infinite' && key[2]) {
    const params = key[2] as Record<string, unknown>

    // Match specific post
    if (params.postId === postId) {
      // Further filter by comment type if needed
      if (isTopLevel && !params.parentId) return true
      if (!isTopLevel && params.parentId === parentId) return true
    }
  }
  return false
}
```

### Pattern 2: Conditional Cache Updates

```typescript
// Only update if query matches comment type
const isTopLevel = !newComment.parentId
const firstPageItems = oldData.pages[0]?.data.items
const targetParentId = firstPageItems?.[0]?.parentId

if (isTopLevel && targetParentId === undefined) {
  // Update top-level query
  return updatedData
} else if (!isTopLevel && targetParentId === newComment.parentId) {
  // Update replies query
  return updatedData
}

// Don't update if types don't match
return oldData
```

### Pattern 3: Update Across All Queries

```typescript
// When updating/deleting, affect ALL queries (all posts, all threads)
predicate: (query) => {
  const key = query.queryKey
  return key[0] === 'blog-comments' && key[1] === 'infinite'
  // No filtering - update everywhere
}
```

---

## 📚 Related Files

- `client/src/hooks/mutations/blog-comment.mutation.ts` - Implementation (this file)
- `client/src/hooks/querys/blog-comment.query.ts` - Query keys & hooks
- `client/src/lib/types/interfaces/apis/blog-comment.interfaces.ts` - Type definitions
- `client/src/lib/apis/client/blog-comment.apis.ts` - API calls

---

## 💬 Conclusion

This blog comment mutation implementation is **already excellent** and demonstrates advanced patterns for nested comments with infinite scroll. The only improvements would be:

1. ⚡ Add optimistic updates for update/delete (optional)
2. 🔄 Use rollback instead of just error toast (optional)

**Current grade: A+ (95/100)**  
**With improvements: A++ (98/100)**

The implementation demonstrates:

- Deep understanding of infinite queries
- Smart predicate matching
- Comment type detection
- Conditional cache updates
- Production-ready patterns
- Clean, maintainable code

**Recommendation:** Use this file as a reference for nested comment systems! 🌟

**Comparison with other files:**

- **Cart mutations**: A+ (95/100) - Best for simple CRUD
- **Blog comment mutations**: A+ (95/100) - Best for nested infinite queries
- Both are excellent examples for different use cases!

---

**Updated:** 2026-04-09  
**Author:** Kiro AI Assistant
