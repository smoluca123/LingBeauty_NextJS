# Blog Feature Implementation

## Tổng Quan

Blog feature đã được implement hoàn chỉnh theo đúng kiến trúc và phong cách code của dự án, bao gồm:

- Admin UI để quản lý blog topics và posts
- Public UI để người dùng xem blog
- Full API integration với backend NestJS
- React Query hooks cho data fetching và mutations
- Zod schemas cho validation

## Cấu Trúc Files

### 1. TypeScript Interfaces

**File:** `client/src/lib/types/interfaces/apis/blog.interfaces.ts`

Định nghĩa các interfaces cho:

- `IBlogTopicDataType` - Blog topic data structure
- `IBlogPostDataType` - Blog post data structure
- `ICreateBlogTopicPayload` - Payload để tạo topic
- `IUpdateBlogTopicPayload` - Payload để update topic
- `ICreateBlogPostPayload` - Payload để tạo post
- `IUpdateBlogPostPayload` - Payload để update post
- `IBlogTopicFilters` - Filters cho topic listing
- `IBlogPostFilters` - Filters cho post listing
- `BlogPostStatus` - Enum cho trạng thái post (DRAFT, PUBLISHED, ARCHIVED)

### 2. Server API Functions

**File:** `client/src/lib/apis/server/blog-apis.ts`

Server-side API functions với caching:

- `getPublicBlogTopicsAPI()` - Lấy topics công khai (có cache)
- `getPublicBlogTopicBySlugAPI()` - Lấy topic theo slug (có cache)
- `getPublicBlogPostsAPI()` - Lấy posts công khai (có cache)
- `getPublicBlogPostBySlugAPI()` - Lấy post theo slug (có cache, tự động tăng view count)
- `getAllBlogTopicsAPI()` - Admin: lấy tất cả topics
- `createBlogTopicAPI()` - Admin: tạo topic
- `updateBlogTopicAPI()` - Admin: update topic
- `deleteBlogTopicAPI()` - Admin: xóa topic
- `uploadTopicImageAPI()` - Admin: upload ảnh topic
- `getAllBlogPostsAPI()` - Admin: lấy tất cả posts
- `createBlogPostAPI()` - Admin: tạo post
- `updateBlogPostAPI()` - Admin: update post
- `deleteBlogPostAPI()` - Admin: xóa post
- `uploadPostFeaturedImageAPI()` - Admin: upload ảnh featured

### 3. Client API Functions

**File:** `client/src/lib/apis/client/blog.apis.ts`

Client-side API functions gọi Next.js API routes:

- Tương tự server APIs nhưng gọi qua `kyNextInstance`
- Có error handling với `extractErrorMessage()`
- Tất cả functions đều có suffix `ClientAPI`

### 4. Next.js API Route Handlers

#### Public Routes:

- `client/src/app/api/public/blog-topic/route.ts` - GET topics
- `client/src/app/api/public/blog-topic/slug/[slug]/route.ts` - GET topic by slug
- `client/src/app/api/public/blog-post/route.ts` - GET posts
- `client/src/app/api/public/blog-post/slug/[slug]/route.ts` - GET post by slug

#### Admin Routes:

- `client/src/app/api/admin/blog-topic/route.ts` - GET/POST topics
- `client/src/app/api/admin/blog-topic/[id]/route.ts` - GET/PATCH/DELETE topic
- `client/src/app/api/admin/blog-topic/[id]/upload/image/route.ts` - POST upload image
- `client/src/app/api/admin/blog-post/route.ts` - GET/POST posts
- `client/src/app/api/admin/blog-post/[id]/route.ts` - GET/PATCH/DELETE post
- `client/src/app/api/admin/blog-post/[id]/upload/featured-image/route.ts` - POST upload image

### 5. React Query Hooks

#### Query Hooks (`client/src/hooks/querys/blog.query.ts`):

- `useBlogTopicsQuery()` - Admin: fetch topics với pagination
- `useBlogPostsQuery()` - Admin: fetch posts với pagination
- `usePublicBlogTopicsQuery()` - Public: fetch topics
- `usePublicBlogTopicBySlugQuery()` - Public: fetch topic by slug
- `usePublicBlogPostsQuery()` - Public: fetch posts
- `usePublicBlogPostBySlugQuery()` - Public: fetch post by slug

Query keys được organize theo hierarchy:

```typescript
blogQueryKeys = {
  topics: ['admin', 'blog-topics'],
  topicsList: (params) => ['admin', 'blog-topics', 'list', params],
  posts: ['admin', 'blog-posts'],
  postsList: (params) => ['admin', 'blog-posts', 'list', params],
  publicTopics: ['public', 'blog-topics'],
  // ...
}
```

#### Mutation Hooks (`client/src/hooks/mutations/blog.mutation.ts`):

- `useCreateBlogTopicMutation()` - Tạo topic
- `useUpdateBlogTopicMutation()` - Update topic
- `useDeleteBlogTopicMutation()` - Xóa topic
- `useUploadTopicImageMutation()` - Upload ảnh topic
- `useCreateBlogPostMutation()` - Tạo post
- `useUpdateBlogPostMutation()` - Update post
- `useDeleteBlogPostMutation()` - Xóa post
- `useUploadPostFeaturedImageMutation()` - Upload ảnh post

Tất cả mutations đều:

- Invalidate query cache sau khi thành công
- Show toast notification (success/error)
- Handle errors properly

### 6. Zod Schemas

**File:** `client/src/lib/schemas/blog.schema.ts`

- `blogTopicSchema` - Validation cho topic form
- `blogPostSchema` - Validation cho post form
- Export types: `BlogTopicFormValues`, `BlogPostFormValues`

### 7. Admin UI Components

**Đã có sẵn trong:** `client/src/app/admin/blog/components/`

#### Topics:

- `blog-topics-tab.tsx` - Tab hiển thị danh sách topics
- `blog-topics-table.tsx` - Table component
- `blog-topic-form.tsx` - Form tạo/sửa topic
- `create-topic-dialog.tsx` - Dialog tạo topic
- `edit-topic-dialog.tsx` - Dialog sửa topic
- `delete-topic-dialog.tsx` - Dialog xác nhận xóa

#### Posts:

- `blog-posts-tab.tsx` - Tab hiển thị danh sách posts
- `blog-posts-table.tsx` - Table component
- `blog-post-form.tsx` - Form tạo/sửa post (có TipTap editor)
- `create-post-dialog.tsx` - Dialog tạo post
- `edit-post-dialog.tsx` - Dialog sửa post
- `delete-post-dialog.tsx` - Dialog xác nhận xóa

### 8. Public UI Components

#### Blog Listing Page:

**File:** `client/src/app/(main)/blog/page.tsx`

- Server component với metadata
- Render `BlogListingContent`

**File:** `client/src/app/(main)/blog/components/blog-listing-content.tsx`

- Client component
- Sidebar với search và topic filter
- Grid layout hiển thị blog cards
- Pagination với "Xem thêm" button
- Loading và empty states

**File:** `client/src/app/(main)/blog/components/blog-post-card.tsx`

- Card component cho mỗi blog post
- Hiển thị: featured image, title, excerpt, topic badge, date, view count
- Hover effects
- Link to post detail

**File:** `client/src/app/(main)/blog/components/blog-topic-filter.tsx`

- Sidebar filter component
- List topics với post count
- Active state highlighting

#### Blog Detail Page:

**File:** `client/src/app/(main)/blog/[slug]/page.tsx`

- Server component với dynamic metadata (SEO)
- Fetch post data server-side
- Handle 404 với `notFound()`

**File:** `client/src/app/(main)/blog/[slug]/components/blog-post-content.tsx`

- Client component
- Full blog post layout
- Featured image
- Title, excerpt, metadata (date, views, author)
- HTML content rendering với `dangerouslySetInnerHTML`
- Tags display
- Back button

## API Flow

### Public Blog Flow:

```
User → Blog Listing Page
  ↓
usePublicBlogPostsQuery()
  ↓
getPublicBlogPostsClientAPI()
  ↓
kyNextInstance.get('/api/public/blog-post')
  ↓
Next.js Route Handler (/api/public/blog-post/route.ts)
  ↓
getPublicBlogPostsAPI() (server)
  ↓
publicKyInstance.get('public/blog-post')
  ↓
NestJS Backend (http://localhost:8080/public/blog-post)
```

### Admin Blog Flow:

```
Admin → Blog Management Page
  ↓
useBlogPostsQuery()
  ↓
getAllBlogPostsClientAPI()
  ↓
kyNextInstance.get('/api/admin/blog-post')
  ↓
Next.js Route Handler (/api/admin/blog-post/route.ts)
  ↓
getAllBlogPostsAPI() (server)
  ↓
kyInstance.get('blog-post') [with auth]
  ↓
NestJS Backend (http://localhost:8080/blog-post)
```

## Features Implemented

### Admin Features:

✅ Quản lý Blog Topics

- Tạo/sửa/xóa topics
- Upload ảnh cho topic
- Set parent topic (sub-topics)
- Sort order
- Active/inactive status
- Search và filter

✅ Quản lý Blog Posts

- Tạo/sửa/xóa posts
- Rich text editor (TipTap) với preview
- Upload featured image
- Select topic
- Status management (Draft/Published/Archived)
- Tags management
- SEO fields (meta title, meta description)
- Search và filter (by topic, status, tags)
- Sort by date, title, view count

### Public Features:

✅ Blog Listing Page

- Grid layout responsive
- Search posts
- Filter by topic
- Pagination
- Post cards với featured image
- Topic badges
- View count display

✅ Blog Detail Page

- Full post content
- Featured image
- Author info
- View count (auto increment)
- Tags display
- Related topic link
- SEO metadata
- Back navigation

### Performance Optimizations:

✅ Server-side caching với Next.js cache

- `'use cache'` directive
- `cacheLife()` configuration
- `cacheTag()` for invalidation

✅ React Query caching

- `staleTime` configuration
- `placeholderData` for smooth pagination
- Query invalidation sau mutations

✅ Image optimization

- Next.js Image component
- Lazy loading
- Responsive images

## Navigation Integration

Blog link đã được thêm vào:

- Footer navigation (`/blog`)
- Có thể thêm vào header navigation nếu cần

## Backend API Endpoints

Theo documentation trong `server/docs/api/BLOG_API.md`:

### Public Endpoints:

- `GET /public/blog-topic` - Lấy topics (active only)
- `GET /public/blog-topic/slug/:slug` - Lấy topic by slug
- `GET /public/blog-post` - Lấy posts (published only)
- `GET /public/blog-post/slug/:slug` - Lấy post by slug (tăng view count)

### Admin Endpoints (require auth):

- `GET /blog-topic` - Lấy tất cả topics
- `POST /blog-topic` - Tạo topic
- `GET /blog-topic/:id` - Lấy topic by ID
- `PATCH /blog-topic/:id` - Update topic
- `DELETE /blog-topic/:id` - Xóa topic
- `POST /blog-topic/:id/upload/image` - Upload ảnh
- `POST /blog-topic/:parentId/sub-topic` - Tạo sub-topic

- `GET /blog-post` - Lấy tất cả posts
- `POST /blog-post` - Tạo post
- `GET /blog-post/:id` - Lấy post by ID
- `PATCH /blog-post/:id` - Update post
- `DELETE /blog-post/:id` - Xóa post
- `POST /blog-post/:id/upload/featured-image` - Upload ảnh

## Testing Checklist

### Admin Testing:

- [ ] Tạo blog topic mới
- [ ] Upload ảnh cho topic
- [ ] Tạo sub-topic
- [ ] Edit topic
- [ ] Xóa topic
- [ ] Tạo blog post mới
- [ ] Sử dụng rich text editor
- [ ] Upload featured image
- [ ] Add tags
- [ ] Change status (Draft → Published)
- [ ] Edit post
- [ ] Xóa post
- [ ] Search posts
- [ ] Filter by topic
- [ ] Filter by status

### Public Testing:

- [ ] Truy cập `/blog`
- [ ] Xem danh sách posts
- [ ] Search posts
- [ ] Filter by topic
- [ ] Click vào post card
- [ ] Xem post detail
- [ ] Verify view count tăng
- [ ] Click tags
- [ ] Back navigation
- [ ] Responsive trên mobile

## Best Practices Followed

✅ **Vercel React Best Practices:**

- Server Components cho initial data fetching
- Client Components chỉ khi cần interactivity
- Parallel data fetching với Promise.all
- Proper caching strategy
- Image optimization

✅ **Project Code Style:**

- Consistent naming conventions
- Proper file organization
- TypeScript strict typing
- Error handling ở mọi layer
- Zod validation
- React Query patterns
- Proper API flow architecture

✅ **Performance:**

- Server-side caching
- Client-side caching
- Lazy loading
- Optimistic updates
- Pagination

✅ **UX:**

- Loading states
- Empty states
- Error messages (Vietnamese)
- Toast notifications
- Responsive design
- Smooth transitions

## Environment Variables

Backend URL đã được config trong `client/.env`:

```env
NEXT_PUBLIC_API_URL="http://192.168.1.212:8080/"
```

## Next Steps (Optional Enhancements)

1. **Related Posts:** Hiển thị bài viết liên quan ở cuối post detail
2. **Comments:** Thêm comment system cho blog posts
3. **Social Share:** Thêm nút share lên social media
4. **Reading Time:** Tính toán và hiển thị thời gian đọc
5. **Table of Contents:** Auto-generate TOC từ headings
6. **Search Highlighting:** Highlight search terms trong results
7. **Breadcrumbs:** Add breadcrumb navigation
8. **RSS Feed:** Generate RSS feed cho blog
9. **Newsletter:** Subscribe form cho blog updates
10. **Analytics:** Track popular posts, reading patterns

## Troubleshooting

### Issue: API calls fail

- Check backend URL trong `.env`
- Verify backend server đang chạy
- Check network tab trong DevTools

### Issue: Images không hiển thị

- Verify image URLs từ backend
- Check Next.js Image domains config
- Verify upload permissions

### Issue: Cache không invalidate

- Check query keys matching
- Verify mutation success callbacks
- Clear browser cache

### Issue: Editor không hoạt động

- Check TipTap editor component
- Verify dependencies installed
- Check console for errors

## Kết Luận

Blog feature đã được implement hoàn chỉnh theo đúng:

- ✅ Backend API documentation
- ✅ Project code style guide
- ✅ Vercel React best practices
- ✅ Existing codebase patterns

Tất cả files đã được tạo và integrate đúng với kiến trúc hiện tại. Admin UI đã có sẵn và hoạt động. Public UI đã được tạo mới với responsive design và UX tốt.
