# Blog Comment Reply Button Fix

## 🐛 Issue: Reply Button Disappears After Deleting Any Comment

### Problem Description

When deleting ANY comment (top-level or reply), the "View replies" button disappears from ALL other comments, even if they still have replies.

### Root Cause

The delete and update mutations were updating ALL infinite queries without checking if the comment being modified actually exists in that query.

```typescript
// ❌ BEFORE: Updates ALL queries
queryClient.setQueriesData(
  {
    predicate: (query) => {
      return key[0] === 'blog-comments' && key[1] === 'infinite'
    },
  },
  (oldData) => {
    // Always updates, even if comment doesn't exist in this query
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          items: page.data.items.filter((comment) => comment.id !== commentId),
          totalCount: Math.max(0, page.data.totalCount - 1), // ❌ Decrements even if comment not found
        },
      })),
    }
  },
)
```

### Why This Caused the Issue

1. **Multiple Queries**: Each comment has its own infinite query for replies:
   - Main comments: `['blog-comments', 'infinite', { postId: 'x', parentId: 'null' }]`
   - Comment A replies: `['blog-comments', 'infinite', { parentId: 'commentA' }]`
   - Comment B replies: `['blog-comments', 'infinite', { parentId: 'commentB' }]`

2. **Incorrect Updates**: When deleting Comment A:
   - Mutation updates ALL queries (main + all reply queries)
   - Comment B's reply query gets `totalCount - 1` even though Comment A doesn't exist there
   - If Comment B had 1 reply, `totalCount` becomes 0
   - Button disappears because `replyCount === 0`

3. **Component Logic**: In `CommentReplies.tsx`:

   ```typescript
   const replyCount = data?.pages[0]?.data.totalCount ?? 0

   if (!showReplies && replyCount === 0) return null // ❌ Button hidden
   ```

---

## ✅ Solution

Check if the comment exists in the query before updating it.

### Fixed Delete Mutation

```typescript
export const useDeleteBlogCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogCommentClientAPI(id),
    onSuccess: (_, commentId) => {
      queryClient.setQueriesData<InfiniteData<...>>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          // ✅ Check if this comment exists in this query
          const commentExists = oldData.pages.some((page) =>
            page.data.items.some((comment) => comment.id === commentId),
          )

          // ✅ Only update if the comment exists in this query
          if (!commentExists) return oldData

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

### Fixed Update Mutation

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

      queryClient.setQueriesData<InfiniteData<...>>(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'blog-comments' && key[1] === 'infinite'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          // ✅ Check if this comment exists in this query
          const commentExists = oldData.pages.some((page) =>
            page.data.items.some((comment) => comment.id === variables.id),
          )

          // ✅ Only update if the comment exists in this query
          if (!commentExists) return oldData

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

---

## 🎯 How It Works Now

### Scenario: Delete Comment A

1. **Query Check**: Mutation checks each query:
   - Main comments query: Contains Comment A? ✅ Yes → Update (remove + decrement)
   - Comment A replies query: Contains Comment A? ❌ No → Skip (return oldData)
   - Comment B replies query: Contains Comment A? ❌ No → Skip (return oldData)
   - Comment C replies query: Contains Comment A? ❌ No → Skip (return oldData)

2. **Result**:
   - Comment A removed from main list ✅
   - Comment B's reply count unchanged ✅
   - Comment C's reply count unchanged ✅
   - All "View replies" buttons remain visible ✅

### Scenario: Update Comment A

1. **Query Check**: Mutation checks each query:
   - Main comments query: Contains Comment A? ✅ Yes → Update content
   - Comment A replies query: Contains Comment A? ❌ No → Skip
   - Comment B replies query: Contains Comment A? ❌ No → Skip

2. **Result**:
   - Comment A content updated in main list ✅
   - Other queries unaffected ✅

---

## 📊 Performance Impact

### Before Fix

- Updates: O(n × m) where n = number of queries, m = items per query
- All queries processed even if comment doesn't exist

### After Fix

- Check: O(n × m) to find comment
- Update: O(m) only for matching queries
- Skip: O(1) for non-matching queries

**Net Result**: Slightly more work upfront (existence check), but prevents incorrect updates and maintains data integrity.

---

## 🔑 Key Learnings

### 1. Predicate Pattern Caveat

Using predicate to match multiple queries is powerful, but you must ensure updates are appropriate for each matched query.

```typescript
// ⚠️ Matches ALL blog-comments infinite queries
predicate: (query) => {
  return key[0] === 'blog-comments' && key[1] === 'infinite'
}

// ✅ Must check if update is relevant to each query
(oldData) => {
  const commentExists = oldData.pages.some(...)
  if (!commentExists) return oldData // Skip irrelevant queries
  // ... update logic
}
```

### 2. Nested Queries

When dealing with nested data (comments → replies), each level has its own query. Updates must be scoped correctly.

### 3. TotalCount Integrity

Decrementing `totalCount` without checking if the item exists leads to incorrect counts and broken UI logic.

### 4. Early Return Pattern

```typescript
// ✅ Good pattern for conditional updates
;(oldData) => {
  if (!oldData) return oldData
  if (!shouldUpdate) return oldData
  // ... update logic
}
```

---

## 🧪 Testing

### Test Cases

1. ✅ Delete top-level comment → Only main list updated
2. ✅ Delete reply → Only that comment's reply list updated
3. ✅ Update top-level comment → Only main list updated
4. ✅ Update reply → Only that comment's reply list updated
5. ✅ Multiple comments with replies → Each maintains correct count
6. ✅ Reply button visibility → Shows when replyCount > 0

### Expected Behavior

- Deleting Comment A doesn't affect Comment B's reply count
- Updating Comment A doesn't affect Comment B's reply list
- Reply buttons remain visible for comments with replies
- Counts are accurate across all queries

---

## 🔧 Related Files

- `client/src/hooks/mutations/blog-comment.mutation.ts` - Fixed mutations
- `client/src/app/(main)/blog/[slug]/components/comment-replies.tsx` - Reply button component
- `client/src/app/(main)/blog/[slug]/components/comment-item.tsx` - Comment display
- `client/src/hooks/querys/blog-comment.query.ts` - Query definitions

---

**Fixed:** 2026-04-10  
**Author:** Kiro AI Assistant  
**Status:** ✅ Working correctly
