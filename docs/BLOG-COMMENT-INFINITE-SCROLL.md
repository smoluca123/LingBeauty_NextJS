# Blog Comment Infinite Scroll Implementation

Tài liệu này mô tả việc triển khai infinite scroll cho hệ thống bình luận blog.

## 🎯 Tổng Quan

Infinite scroll đã được áp dụng cho:

- Top-level comments (bình luận chính)
- Nested replies (câu trả lời)

## 🔧 Implementation Details

### 1. React Query Hooks

#### useInfiniteBlogCommentsQuery

```typescript
export const useInfiniteBlogCommentsQuery = (
  params: Omit<IBlogCommentFilters, 'page'> = {},
) =>
  useInfiniteQuery({
    queryKey: blogCommentQueryKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      getBlogCommentsClientAPI({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextPage = lastPage.data.hasNextPage
      const currentPage = lastPage.data.currentPage
      return hasNextPage ? currentPage + 1 : undefined
    },
    staleTime: 1000 * 30,
  })
```

**Features:**

- Tự động quản lý pagination
- Cache mỗi page riêng biệt
- Hỗ trợ `fetchNextPage()` để load thêm
- `hasNextPage` để kiểm tra còn data không
- `isFetchingNextPage` để hiển thị loading state

### 2. Comment Section Component

```tsx
export function CommentSection({ postId }: CommentSectionProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBlogCommentsQuery({
      postId,
      parentId: 'null',
      limit: 10,
    })

  const comments = data?.pages.flatMap((page) => page.data.items) ?? []
  const totalCount = data?.pages[0]?.data.totalCount ?? 0

  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      isShowInViewElement={hasNextPage && !isFetchingNextPage}
    >
      <CommentList comments={comments} postId={postId} />
    </InfiniteScrollContainer>
  )
}
```

**Key Points:**

- `data.pages.flatMap()` để merge tất cả pages thành 1 array
- Chỉ gọi `fetchNextPage()` khi `hasNextPage && !isFetchingNextPage`
- `isShowInViewElement` để hiển thị trigger element

### 3. Comment Replies Component

```tsx
export function CommentReplies({ commentId, postId }: CommentRepliesProps) {
  const [showReplies, setShowReplies] = useState(false)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBlogCommentsQuery({
      parentId: commentId,
      limit: 20,
    })

  const replies = data?.pages.flatMap((page) => page.data.items) ?? []
  const replyCount = data?.pages[0]?.data.totalCount ?? 0

  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      isShowInViewElement={hasNextPage && !isFetchingNextPage}
    >
      <div className="space-y-4">
        {replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
        ))}
      </div>
    </InfiniteScrollContainer>
  )
}
```

### 4. InfiniteScrollContainer

Component này sử dụng `react-intersection-observer` để detect khi user scroll đến cuối:

```tsx
export default function InfiniteScrollContainer({
  children,
  onBottomReached,
  rootMargin = '200px',
  isShowInViewElement = true,
}: IProps) {
  const [ref] = useInView({
    rootMargin: rootMargin,
    onChange: (inView) => {
      if (inView) {
        onBottomReached()
      }
    },
  })

  return (
    <div>
      {children}
      {isShowInViewElement && <div ref={ref}></div>}
    </div>
  )
}
```

**Parameters:**

- `onBottomReached`: Callback khi scroll đến cuối
- `rootMargin`: Khoảng cách trigger trước khi đến cuối (default: 200px)
- `isShowInViewElement`: Hiển thị trigger element hay không

## 🔄 Cache Invalidation

Khi tạo/update/delete comment, cần invalidate cả infinite queries:

```typescript
export const useCreateBlogCommentMutation = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateBlogCommentPayload) =>
      createBlogCommentClientAPI(data),
    onSuccess: () => {
      // Invalidate all comment queries
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.all,
      })
      // Invalidate specific infinite query
      queryClient.invalidateQueries({
        queryKey: blogCommentQueryKeys.infinite({ postId, parentId: 'null' }),
      })
      toast.success('Bình luận thành công')
    },
  })
}
```

## 📊 Performance Benefits

### Before (Pagination)

- Load 10 comments per page
- User phải click "Next page" để xem thêm
- Mất context khi chuyển trang
- Không smooth

### After (Infinite Scroll)

- Load 10 comments ban đầu
- Tự động load thêm 10 khi scroll đến cuối
- Giữ nguyên context, không mất comments đã xem
- Smooth scrolling experience
- Tốt hơn cho mobile

## 🎨 Loading States

### Initial Loading

```tsx
{
  isLoading && (
    <div className="flex justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}
```

### Loading More

```tsx
{
  isFetchingNextPage && (
    <div className="flex justify-center py-4">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Duplicate Comments

**Problem:** Comments bị duplicate khi invalidate queries

**Solution:** Sử dụng unique `queryKey` cho mỗi query:

```typescript
queryKey: blogCommentQueryKeys.infinite({ postId, parentId: 'null' })
```

### Issue 2: Infinite Loop

**Problem:** `fetchNextPage()` được gọi liên tục

**Solution:** Kiểm tra `hasNextPage && !isFetchingNextPage` trước khi gọi:

```typescript
onBottomReached={() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}}
```

### Issue 3: Scroll Position Lost

**Problem:** Scroll position bị reset sau khi create comment

**Solution:** React Query tự động giữ scroll position khi invalidate queries

## 📱 Mobile Optimization

- `rootMargin: '200px'` để trigger sớm hơn trên mobile
- Loading indicator nhỏ gọn
- Smooth scrolling
- Touch-friendly

## 🔮 Future Enhancements

- Virtual scrolling cho performance tốt hơn với hàng nghìn comments
- Pull-to-refresh
- Scroll to top button
- Skeleton loading states
- Optimistic updates khi create comment

## 📚 Related Files

```
client/src/hooks/querys/blog-comment.query.ts
client/src/hooks/mutations/blog-comment.mutation.ts
client/src/app/(main)/blog/[slug]/components/comment-section.tsx
client/src/app/(main)/blog/[slug]/components/comment-replies.tsx
client/src/components/InfiniteScrollContainer.tsx
```

## ✅ Testing

- [ ] Scroll đến cuối để load thêm comments
- [ ] Loading indicator hiển thị khi đang fetch
- [ ] Không có duplicate comments
- [ ] Scroll position được giữ nguyên
- [ ] Hoạt động tốt trên mobile
- [ ] Không có infinite loop
- [ ] Cache invalidation hoạt động đúng
- [ ] Nested replies cũng có infinite scroll

---

**Lưu ý**: Infinite scroll đã được implement theo đúng pattern của dự án, sử dụng `useInfiniteQuery` và `InfiniteScrollContainer` component có sẵn.
