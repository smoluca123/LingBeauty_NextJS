# Blog Comment System Implementation

Tài liệu này mô tả việc triển khai hệ thống bình luận cho blog theo đúng phong cách và cấu trúc dự án.

## 📋 Tổng Quan

Hệ thống bình luận blog bao gồm:

- Bình luận và trả lời (nested comments)
- Chỉnh sửa và xóa bình luận
- Báo cáo bình luận không phù hợp
- Quản lý báo cáo cho admin

## 🏗️ Cấu Trúc Files Đã Tạo

### 1. TypeScript Interfaces

```
client/src/lib/types/interfaces/apis/blog-comment.interfaces.ts
```

- `IBlogCommentDataType`: Comment data structure
- `IBlogCommentFilters`: Query filters
- `ICreateBlogCommentPayload`: Create comment payload
- `IUpdateBlogCommentPayload`: Update comment payload
- `IBlogCommentReportDataType`: Report data structure
- `BlogCommentReportReason`: Report reason enum
- `BlogCommentReportStatus`: Report status enum

### 2. Server API Functions

```
client/src/lib/apis/server/blog-comment-apis.ts
```

- `getBlogCommentsAPI()`: Get comments (public)
- `getBlogCommentByIdAPI()`: Get comment by ID (public)
- `createBlogCommentAPI()`: Create comment (protected)
- `updateBlogCommentAPI()`: Update comment (protected)
- `deleteBlogCommentAPI()`: Delete comment (protected)
- `createBlogCommentReportAPI()`: Report comment (protected)
- `getAllBlogCommentReportsAPI()`: Get all reports (admin)
- `getBlogCommentReportByIdAPI()`: Get report by ID (admin)
- `updateBlogCommentReportStatusAPI()`: Update report status (admin)
- `adminDeleteBlogCommentAPI()`: Delete comment (admin)

### 3. Next.js Route Handlers

```
client/src/app/api/blog-comment/route.ts
client/src/app/api/blog-comment/[id]/route.ts
client/src/app/api/blog-comment-report/route.ts
client/src/app/api/admin/blog-comment-report/route.ts
client/src/app/api/admin/blog-comment-report/[id]/route.ts
client/src/app/api/admin/blog-comment-report/[id]/status/route.ts
client/src/app/api/admin/blog-comment-report/comment/[id]/route.ts
```

### 4. Client API Functions

```
client/src/lib/apis/client/blog-comment.apis.ts
```

- `getBlogCommentsClientAPI()`
- `getBlogCommentByIdClientAPI()`
- `createBlogCommentClientAPI()`
- `updateBlogCommentClientAPI()`
- `deleteBlogCommentClientAPI()`
- `createBlogCommentReportClientAPI()`

### 5. React Query Hooks

```
client/src/hooks/querys/blog-comment.query.ts
client/src/hooks/mutations/blog-comment.mutation.ts
```

**Query Hooks:**

- `useBlogCommentsQuery()`: Fetch comments with filters
- `useBlogCommentByIdQuery()`: Fetch single comment

**Mutation Hooks:**

- `useCreateBlogCommentMutation()`: Create comment
- `useUpdateBlogCommentMutation()`: Update comment
- `useDeleteBlogCommentMutation()`: Delete comment
- `useReportBlogCommentMutation()`: Report comment

### 6. UI Components

```
client/src/app/(main)/blog/[slug]/components/
├── comment-section.tsx       # Main comment section container
├── comment-form.tsx          # Comment input form
├── comment-list.tsx          # List of comments
├── comment-item.tsx          # Single comment item
├── comment-replies.tsx       # Nested replies
├── edit-comment-dialog.tsx   # Edit comment dialog
├── delete-comment-dialog.tsx # Delete confirmation dialog
└── report-comment-dialog.tsx # Report comment dialog
```

### 7. UI Primitives (shadcn/ui)

```
client/src/components/ui/
├── avatar.tsx        # Avatar component
└── alert-dialog.tsx  # Alert dialog component
```

## 🎨 Component Hierarchy

```
BlogPostContent
└── CommentSection
    ├── CommentForm (top-level)
    └── CommentList
        └── CommentItem
            ├── CommentForm (reply)
            ├── CommentReplies
            │   └── CommentItem (nested)
            ├── EditCommentDialog
            ├── DeleteCommentDialog
            └── ReportCommentDialog
```

## 🔑 Key Features

### 1. Authentication Integration

- Sử dụng `useAuthStore` để kiểm tra user đã đăng nhập
- Hiển thị login prompt nếu chưa đăng nhập
- Chỉ owner mới có thể edit/delete comment của mình

### 2. Nested Comments

- Hỗ trợ reply to comment (1 level)
- Load replies on demand
- Hiển thị số lượng replies

### 3. Real-time Updates

- Sử dụng React Query để cache và invalidate
- Optimistic updates với `placeholderData`
- Auto-refresh sau mutations

### 4. User Experience

- Loading states với spinners
- Error handling với toast notifications
- Confirmation dialogs cho destructive actions
- Responsive design

### 5. Report System

- 5 loại báo cáo: SPAM, INAPPROPRIATE, HARASSMENT, MISINFORMATION, OTHER
- Mô tả chi tiết (optional)
- Admin có thể xem và xử lý reports

## 📝 Usage Examples

### Hiển thị Comment Section

```tsx
import { CommentSection } from './components/comment-section'

export function BlogPostContent({ post }) {
  return (
    <article>
      {/* Post content */}
      <CommentSection postId={post.id} />
    </article>
  )
}
```

### Tạo Comment

```tsx
const mutation = useCreateBlogCommentMutation(postId)

await mutation.mutateAsync({
  postId: 'post-uuid',
  content: 'Great article!',
  parentId: null, // or parent comment ID for reply
})
```

### Báo Cáo Comment

```tsx
const mutation = useReportBlogCommentMutation()

await mutation.mutateAsync({
  commentId: 'comment-uuid',
  reason: BlogCommentReportReason.SPAM,
  description: 'This is spam',
})
```

## 🔐 Permissions

### Public

- Xem comments
- Xem comment by ID

### Authenticated Users

- Tạo comment
- Chỉnh sửa comment của mình
- Xóa comment của mình
- Báo cáo comment của người khác

### Admin

- Xem tất cả reports
- Cập nhật trạng thái report
- Xóa bất kỳ comment nào

## 🎯 Best Practices Followed

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
2. **Type Safety**: TypeScript interfaces cho tất cả data structures
3. **Error Handling**: Proper error messages và toast notifications
4. **Loading States**: Loading indicators cho tất cả async operations
5. **Accessibility**: Semantic HTML và ARIA labels
6. **Performance**: Query caching và optimistic updates
7. **Code Reusability**: Shared components và hooks
8. **Consistent Naming**: Theo đúng quy ước của dự án

## 🚀 Next Steps

### Admin UI (Optional)

Có thể tạo admin pages để quản lý reports:

```
client/src/app/admin/blog-comment-reports/
├── page.tsx                    # List all reports
├── [id]/page.tsx              # Report detail
└── components/
    ├── report-list.tsx
    ├── report-filters.tsx
    └── report-status-badge.tsx
```

### Enhancements (Optional)

- Pagination cho nested replies
- Like/dislike comments
- Sort comments (newest, oldest, most replies)
- Mention users (@username)
- Rich text editor cho comments
- Image attachments
- Email notifications

## 📚 Related Documentation

- [Blog Comment API Documentation](./BLOG-COMMENT-API.md)
- [Project Code Style Guide](../.kiro/steering/project-code-style-guide.md)
- [Blog Feature Implementation](./BLOG-FEATURE-IMPLEMENTATION.md)

## ✅ Testing Checklist

- [ ] User có thể xem comments
- [ ] User có thể tạo comment khi đã đăng nhập
- [ ] User có thể reply to comment
- [ ] User có thể edit comment của mình
- [ ] User có thể delete comment của mình
- [ ] User có thể report comment của người khác
- [ ] User không thể report comment của mình
- [ ] Nested replies hiển thị đúng
- [ ] Loading states hoạt động
- [ ] Error messages hiển thị đúng
- [ ] Toast notifications hoạt động
- [ ] Responsive design trên mobile
- [ ] Admin có thể xem reports
- [ ] Admin có thể update report status
- [ ] Admin có thể delete bất kỳ comment nào

---

**Lưu ý**: Hệ thống comment đã được implement đầy đủ theo đúng phong cách và cấu trúc của dự án. Tất cả các files đã được tạo và tích hợp vào blog post page.
