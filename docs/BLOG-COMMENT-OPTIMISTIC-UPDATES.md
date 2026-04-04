# Blog Comment Optimistic Updates

Tài liệu này mô tả việc triển khai optimistic updates cho hệ thống bình luận blog sử dụng `setQueryData` thay vì `invalidateQueries`.

## 🎯 Tại Sao Sử Dụng Optimistic Updates?

### Before (invalidateQueries)

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: blogCommentQueryKeys.all })
  // ❌ Refetch toàn bộ comments từ server
  // ❌ Loading state hiển thị
  // ❌ Scroll position có thể bị mất
  // ❌ Chậm hơn
}
```

### After (setQueryData)

```typescript
onSuccess: (response) => {
  queryClient.setQueriesData(...)
  // ✅ Update cache trực tiếp
  // ✅ Không có loading state
  // ✅ Giữ nguyên scroll position
  // ✅ Instant feedback
}
```

## 🔧 Implementation Details

### 1. Create Comment Mutation

```typescript
export const useCreateBlogCommentMutation = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBlogCommentPayload) =>
      createBlogCommentClientAPI(data),
    onSuccess: (response) => {
      const newComment = response.data

      // Update infinite query data - prepend new comment to the first page
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            // Match infinite queries for this post
            if (
              key[0] === 'blog-comments' &&
              key[1] === 'infinite' &&
              key[2] &&
              typeof key[2] === 'object'
            ) {
              const params = key[2] as Record<string, unknown>
              return params.postId === postId
            }
            return false
          },
        },
        (oldData) => {
          if (!oldData || !oldData.pages.length) return oldData

          // Determine if this is a top-level comment or reply
          const isTopLevel = !newComment.parentId
          const firstPageItems = oldData.pages[0]?.data.items
          const targetParentId = firstPageItems?.[0]?.parentId

          // Only update if the query matches the comment type
          if (isTopLevel && targetParentId === undefined) {
            // Add new top-level comment to the first page
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
          } else if (!isTopLevel && targetParentId === newComment.parentId) {
            // Add new reply to the first page
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
          }

          return oldData
        },
      )

      toast.success('Bình luận thành công')
    },
  })
}
```

**Key Points:**

- Sử dụng `setQueriesData` với `predicate` để match tất cả queries liên quan
- Prepend comment mới vào đầu first page
- Tăng `totalCount` lên 1
- Phân biệt top-level comment và reply
- Type-safe với `InfiniteData<T>`

### 2. Update Comment Mutation

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
    onSuccess: (response, variables) => {
      const updatedComment = response.data

      // Update infinite query data - update the comment in all pages
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
  })
}
```

**Key Points:**

- Update comment trong tất cả pages
- Sử dụng `map` để tìm và replace comment
- Giữ nguyên structure của infinite data

### 3. Delete Comment Mutation

```typescript
export const useDeleteBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogCommentClientAPI(id),
    onSuccess: (_, commentId) => {
      // Update infinite query data - remove the comment from all pages
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

      toast.success('Xóa bình luận thành công')
    },
  })
}
```

**Key Points:**

- Remove comment từ tất cả pages
- Sử dụng `filter` để loại bỏ comment
- Giảm `totalCount` xuống 1 (không âm)

## 🎨 User Experience Benefits

### Instant Feedback

- Comment xuất hiện ngay lập tức sau khi submit
- Không có loading spinner
- Smooth experience

### Scroll Position

- Giữ nguyên scroll position
- Không bị jump khi update cache
- Tốt cho UX

### Performance

- Không cần refetch từ server
- Giảm network requests
- Faster response time

## 🔄 Cache Consistency

### Predicate Matching

```typescript
predicate: (query) => {
  const key = query.queryKey
  if (
    key[0] === 'blog-comments' &&
    key[1] === 'infinite' &&
    key[2] &&
    typeof key[2] === 'object'
  ) {
    const params = key[2] as Record<string, unknown>
    return params.postId === postId
  }
  return false
}
```

**Matches:**

- `['blog-comments', 'infinite', { postId: 'abc', parentId: 'null' }]`
- `['blog-comments', 'infinite', { postId: 'abc', parentId: 'xyz' }]`

**Doesn't Match:**

- `['blog-comments', 'infinite', { postId: 'other' }]`
- `['blog-comments', 'list', { postId: 'abc' }]`

### Type Safety

```typescript
queryClient.setQueriesData<
  InfiniteData<IApiPaginationResponseWrapperType<IBlogCommentDataType>>
>(...)
```

- Full TypeScript support
- Auto-completion
- Compile-time errors

## 🐛 Edge Cases Handled

### 1. Empty Cache

```typescript
if (!oldData || !oldData.pages.length) return oldData
```

Nếu cache rỗng, không update gì cả.

### 2. Top-Level vs Reply

```typescript
const isTopLevel = !newComment.parentId
const targetParentId = firstPageItems?.[0]?.parentId

if (isTopLevel && targetParentId === undefined) {
  // Update top-level comments query
} else if (!isTopLevel && targetParentId === newComment.parentId) {
  // Update replies query
}
```

Chỉ update query đúng loại (top-level hoặc reply).

### 3. Negative Count

```typescript
totalCount: Math.max(0, page.data.totalCount - 1)
```

Đảm bảo totalCount không bao giờ âm.

## 📊 Performance Comparison

### Before (invalidateQueries)

```
User clicks submit
  ↓
API call (200ms)
  ↓
Invalidate queries
  ↓
Refetch from server (200ms)
  ↓
Update UI
  ↓
Total: ~400ms + loading state
```

### After (setQueryData)

```
User clicks submit
  ↓
API call (200ms)
  ↓
Update cache directly
  ↓
Update UI
  ↓
Total: ~200ms, no loading state
```

**Result:** 2x faster, better UX!

## 🔮 Future Enhancements

### Optimistic Updates (Before API Call)

```typescript
onMutate: async (newComment) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: blogCommentQueryKeys.all })

  // Snapshot previous value
  const previousComments = queryClient.getQueryData(...)

  // Optimistically update
  queryClient.setQueryData(...)

  return { previousComments }
},
onError: (err, newComment, context) => {
  // Rollback on error
  queryClient.setQueryData(..., context.previousComments)
},
```

### Conflict Resolution

- Handle concurrent updates
- Merge changes intelligently
- Show conflict UI

## 📚 Related Files

```
client/src/hooks/mutations/blog-comment.mutation.ts
client/src/hooks/querys/blog-comment.query.ts
```

## ✅ Testing

- [ ] Create comment xuất hiện ngay lập tức
- [ ] Update comment cập nhật trong cache
- [ ] Delete comment biến mất ngay lập tức
- [ ] Không có loading state khi mutate
- [ ] Scroll position được giữ nguyên
- [ ] totalCount được update đúng
- [ ] Top-level comments và replies được phân biệt
- [ ] Không có duplicate comments
- [ ] Cache consistency across all queries

---

**Lưu ý**: Optimistic updates đã được implement theo đúng pattern của dự án, sử dụng `setQueriesData` với `InfiniteData` type để update cache trực tiếp thay vì refetch từ server.
