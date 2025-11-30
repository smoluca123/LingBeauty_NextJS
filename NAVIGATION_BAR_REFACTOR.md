# Navigation Bar Refactor - Server Component for SEO

## Tổng quan

Đã refactor Navigation Bar từ Client Component sang Server Component để tối ưu SEO và performance.

## Cấu trúc mới

### 1. Server Component (navigation-bar.tsx)

- **Vai trò**: Fetch data từ API trên server
- **Lợi ích SEO**:
  - HTML chứa đầy đủ links và categories được render trên server
  - Search engines có thể crawl tất cả navigation links
  - Faster First Contentful Paint (FCP)
- **Code**:

```tsx
export async function NavigationBar() {
  const categories = await getCategoriesServerAPI();
  return (
    <Suspense fallback={<NavigationBarLoading />}>
      <NavigationBarClient categories={categories} />
    </Suspense>
  );
}
```

### 2. Client Component (navigation-bar-client.tsx)

- **Vai trò**: Handle interactive features
- **Chức năng**:
  - Embla Carousel slider
  - Dropdown menu interactions
  - Hover effects
  - Navigation arrows
- **Props**: Nhận `categories` từ server component

### 3. Loading Component (navigation-bar-loading.tsx)

- **Vai trò**: Hiển thị skeleton loading state
- **Sử dụng**: Fallback cho Suspense boundary

### 4. Server API (lib/apis/server/header-apis.ts)

- **Vai trò**: Fetch categories từ API trên server
- **Khác biệt với client API**:
  - Không có 'use client' directive
  - Return empty array khi error (không throw)
  - Sử dụng kyServerInstance

### 5. Server Ky Instance (lib/kyInstance/kyServer.ts)

- **Vai trò**: HTTP client cho server-side requests
- **Khác biệt với client instance**: Không có 'use client' directive

## Lợi ích

### SEO

1. **Server-Side Rendering**: Categories được render trên server, HTML đầy đủ
2. **Crawlable Links**: Search engines có thể index tất cả category links
3. **Faster Initial Load**: Không cần wait cho client-side API call
4. **Better Core Web Vitals**: Improved FCP và LCP

### Performance

1. **Reduced Client Bundle**: Logic fetch data không ship về client
2. **Parallel Data Fetching**: Server có thể fetch data song song
3. **Caching**: Next.js có thể cache server component output
4. **Streaming**: Sử dụng Suspense để stream content

### Developer Experience

1. **Separation of Concerns**: Server logic tách biệt với client logic
2. **Type Safety**: Props được type-check giữa server và client
3. **Easier Testing**: Server và client components test riêng biệt

## Cách sử dụng

```tsx
// Trong Header component (server component)
export default function Header() {
  return (
    <header>
      <NavigationBar /> {/* Async server component */}
    </header>
  );
}
```

## Caching Strategy

Có thể thêm caching cho server component:

```tsx
export async function NavigationBar() {
  const categories = await getCategoriesServerAPI();
  // Next.js tự động cache kết quả

  return (
    <Suspense fallback={<NavigationBarLoading />}>
      <NavigationBarClient categories={categories} />
    </Suspense>
  );
}
```

Hoặc config revalidation:

```tsx
export const revalidate = 3600; // Revalidate every hour
```

## Migration Notes

### Trước (Client Component)

- Toàn bộ component là 'use client'
- Fetch data với React Query (useCategoriesQuery)
- Loading state với isLoading
- Tất cả logic trong 1 file

### Sau (Server + Client)

- Server component fetch data
- Client component handle interactions
- Loading state với Suspense
- Logic tách thành 3 files

## Best Practices

1. **Server Component**: Chỉ fetch data và pass props
2. **Client Component**: Chỉ handle interactions
3. **Loading Component**: Giữ UI consistent với actual component
4. **Error Handling**: Server API return empty array thay vì throw
5. **Type Safety**: Share interfaces giữa server và client

## Future Improvements

1. **Add Error Boundary**: Handle fetch errors gracefully
2. **Add Revalidation**: Config ISR cho categories
3. **Add Caching Headers**: Optimize CDN caching
4. **Add Analytics**: Track navigation interactions
5. **Add A/B Testing**: Test different navigation layouts
