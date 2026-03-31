# Blog Pagination Update

## Overview

Updated blog listing page to have proper pagination controls instead of just "Load More" button.

## Changes Made

### Before:

- ❌ Only "Xem thêm" (Load More) button
- ❌ No page numbers
- ❌ No previous page navigation
- ❌ No total count display

### After:

- ✅ Previous/Next buttons with icons
- ✅ Current page / Total pages display
- ✅ Total items count display
- ✅ Disabled states for buttons
- ✅ Responsive layout (mobile-friendly)
- ✅ Consistent with admin pagination style

## Updated File

**File:** `client/src/app/(main)/blog/components/blog-listing-content.tsx`

### Key Changes:

#### 1. Added More Pagination Data

```typescript
const totalCount = postsResult?.data?.totalCount ?? 0
const totalPages = postsResult?.data?.totalPage ?? 1
const hasNextPage = postsResult?.data?.hasNextPage ?? false
const hasPreviousPage = postsResult?.data?.hasPreviousPage ?? false
```

#### 2. Added Pagination Icons

```typescript
import { ChevronLeft, ChevronRight } from 'lucide-react'
```

#### 3. Replaced "Load More" with Proper Pagination

```typescript
{totalPages > 1 && (
  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
    {/* Count Display */}
    <p className="text-sm text-muted-foreground">
      Hiển thị{' '}
      <span className="font-medium">
        {(page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, totalCount)}
      </span>{' '}
      trong <span className="font-medium">{totalCount}</span> bài viết
    </p>

    {/* Navigation Buttons */}
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={!hasPreviousPage || isLoading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Trước
      </Button>

      <span className="text-sm text-muted-foreground px-2">
        Trang {page} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={!hasNextPage || isLoading}
      >
        Tiếp
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  </div>
)}
```

#### 4. Fixed Tailwind Warning

Changed `flex-shrink-0` to `shrink-0` (modern Tailwind syntax)

## Features

### 1. **Count Display**

Shows current range and total:

```
Hiển thị 1–12 trong 45 bài viết
```

### 2. **Page Navigation**

- Previous button (disabled on first page)
- Current page / Total pages
- Next button (disabled on last page)

### 3. **Responsive Design**

- Mobile: Stacked layout (count on top, buttons below)
- Desktop: Horizontal layout (count left, buttons right)

### 4. **Loading States**

- Buttons disabled during loading
- Prevents multiple simultaneous requests

### 5. **Smart Navigation**

- Can't go below page 1
- Can't go above total pages
- Resets to page 1 when search/filter changes

## Pagination Behavior

### When User Changes Search/Filter:

```typescript
onChange={(e) => {
  setSearchQuery(e.target.value)
  setPage(1) // Reset to first page
}}
```

### Navigation Logic:

```typescript
// Previous: Math.max(1, page - 1)
// Next: Math.min(totalPages, page + 1)
```

### Disabled States:

- Previous button: `!hasPreviousPage || isLoading`
- Next button: `!hasNextPage || isLoading`

## Comparison with Admin Pagination

Both admin and public blog now use the same pagination pattern:

| Feature               | Admin | Public |
| --------------------- | ----- | ------ |
| Previous/Next buttons | ✅    | ✅     |
| Page numbers          | ✅    | ✅     |
| Count display         | ✅    | ✅     |
| Disabled states       | ✅    | ✅     |
| Icons                 | ✅    | ✅     |
| Responsive            | ✅    | ✅     |

## Backend API Support

The pagination works with backend API response structure:

```typescript
{
  data: {
    items: [...],
    totalCount: 45,
    totalPage: 4,
    currentPage: 1,
    pageSize: 12,
    hasNextPage: true,
    hasPreviousPage: false
  }
}
```

All required fields are provided by the backend according to `BLOG_API.md`.

## Testing Checklist

- [x] Navigate to next page
- [x] Navigate to previous page
- [x] Previous button disabled on first page
- [x] Next button disabled on last page
- [x] Count display shows correct range
- [x] Page numbers update correctly
- [x] Search resets to page 1
- [x] Filter resets to page 1
- [x] Responsive layout on mobile
- [x] Loading states work correctly
- [x] Buttons disabled during loading

## User Experience Improvements

### Before:

1. User clicks "Xem thêm"
2. More posts append to list
3. No way to go back
4. No indication of total posts
5. Infinite scroll confusion

### After:

1. User sees total posts count
2. Clear page navigation
3. Can go back to previous pages
4. Knows current position (page X of Y)
5. Traditional pagination UX

## Performance

- ✅ No change in API calls (still fetches one page at a time)
- ✅ React Query caching works the same
- ✅ `placeholderData` keeps UI smooth during page changes
- ✅ No unnecessary re-renders

## Future Enhancements (Optional)

1. **Jump to Page:** Add input to jump to specific page
2. **Page Size Selector:** Let users choose 12/24/48 items per page
3. **URL Params:** Sync page number with URL query params
4. **Scroll to Top:** Auto-scroll to top when page changes
5. **Keyboard Navigation:** Arrow keys for prev/next
6. **First/Last Buttons:** Quick jump to first/last page

## Conclusion

Blog pagination is now complete and consistent with the rest of the application. Users have full control over navigation with clear feedback about their position in the content.
