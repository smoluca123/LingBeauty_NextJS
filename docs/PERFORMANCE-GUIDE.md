# PERFORMANCE OPTIMIZATION GUIDE

Hướng dẫn tối ưu performance cho LingBeauty Client

---

## 📊 PERFORMANCE METRICS

### Target Metrics (Lighthouse):

- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Core Web Vitals:

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## ✅ OPTIMIZATIONS APPLIED

### 1. React Component Optimization

#### Memoization

Đã thêm `React.memo` cho các components:

- ✅ `ProductPrice` - Tránh re-render khi props không đổi
- ✅ `ProductBadges` - Expensive calculations được cache
- ✅ `RatingStars` - Static rendering với memo

**Cách sử dụng:**

```tsx
import { memo } from 'react'

export const MyComponent = memo(({ prop1, prop2 }) => {
  // Component logic
  return <div>...</div>
})

MyComponent.displayName = 'MyComponent'
```

**Khi nào dùng memo:**

- Component render nhiều lần với cùng props
- Component có expensive calculations
- Component trong list/grid lớn

**Khi nào KHÔNG dùng memo:**

- Component đơn giản, render nhanh
- Props thay đổi thường xuyên
- Component chỉ render 1 lần

---

### 2. Console.log Cleanup

Đã wrap tất cả console.log với development check:

```tsx
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

**Lợi ích:**

- Giảm overhead trong production
- Tránh leak sensitive data
- Cleaner production logs

---

### 3. Image Optimization

**Đã implement:**

- ✅ Next.js Image component với lazy loading
- ✅ Responsive images với srcset
- ✅ WebP format với fallback

**Best practices:**

```tsx
import Image from 'next/image'

;<Image
  src={imageUrl}
  alt="Product name"
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>
```

---

### 4. Code Splitting

**Đã implement:**

- ✅ Dynamic imports cho heavy components
- ✅ Route-based code splitting (Next.js default)
- ✅ Suspense boundaries với loading states

**Example:**

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Nếu không cần SSR
})
```

---

### 5. Caching Strategy

**Server Components:**

```tsx
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getData() {
  'use cache'
  cacheTag('products')
  cacheLife(DEFAULT_CACHE_TIME)

  return await fetchData()
}
```

**Client-side (React Query):**

```tsx
useQuery({
  queryKey: ['products', params],
  queryFn: () => fetchProducts(params),
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes
})
```

---

## 🔧 TOOLS & SETUP

### Bundle Analyzer

**Install:**

```bash
npm install --save-dev @next/bundle-analyzer
```

**Config (next.config.js):**

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js config
})
```

**Run:**

```bash
ANALYZE=true npm run build
```

---

### Lighthouse CI

**Install:**

```bash
npm install --save-dev @lhci/cli
```

**Config (.lighthouserc.json):**

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## 📋 PERFORMANCE CHECKLIST

### Images

- [ ] Tất cả images dùng Next.js Image component
- [ ] Có width/height để tránh CLS
- [ ] Dùng lazy loading cho below-the-fold images
- [ ] Optimize image sizes (max 200KB cho product images)
- [ ] Sử dụng WebP format

### JavaScript

- [ ] Remove unused dependencies
- [ ] Tree-shaking enabled
- [ ] Code splitting cho routes
- [ ] Dynamic imports cho heavy components
- [ ] No console.logs trong production

### CSS

- [ ] Tailwind CSS purge enabled
- [ ] Critical CSS inlined
- [ ] No unused CSS classes
- [ ] CSS minification enabled

### Fonts

- [ ] Font preloading
- [ ] Font subsetting
- [ ] Font display: swap

### API Calls

- [ ] Implement caching
- [ ] Parallel requests với Promise.all
- [ ] Pagination cho large lists
- [ ] Debounce search inputs

### React

- [ ] Use React.memo cho expensive components
- [ ] Use useMemo cho expensive calculations
- [ ] Use useCallback cho event handlers
- [ ] Avoid inline functions trong render
- [ ] Key props cho lists

---

## 🎯 OPTIMIZATION PRIORITIES

### High Priority (Làm ngay)

1. ✅ Remove console.logs
2. ✅ Add React.memo cho product components
3. ✅ Optimize images
4. ⏳ Bundle size analysis
5. ⏳ Lighthouse audit

### Medium Priority (Sprint tiếp theo)

1. ⏳ Implement virtual scrolling cho long lists
2. ⏳ Add service worker cho offline support
3. ⏳ Optimize third-party scripts
4. ⏳ Implement prefetching cho critical routes

### Low Priority (Khi có thời gian)

1. ⏳ Add performance monitoring (Sentry, DataDog)
2. ⏳ Implement edge caching
3. ⏳ Optimize database queries
4. ⏳ Add CDN cho static assets

---

## 📈 MONITORING

### Metrics to Track

- Page load time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- API response times
- Error rates

### Tools

- Google Analytics 4
- Vercel Analytics
- Sentry Performance Monitoring
- Chrome DevTools Performance tab

---

## 🚀 DEPLOYMENT OPTIMIZATION

### Build Optimization

```bash
# Production build
npm run build

# Analyze bundle
ANALYZE=true npm run build

# Check bundle size
npm run build && ls -lh .next/static/chunks
```

### Environment Variables

```env
# Production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://lingbeauty.com

# Enable optimizations
NEXT_TELEMETRY_DISABLED=1
```

---

## 📚 RESOURCES

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Last Updated:** 06/04/2026  
**Maintained by:** Frontend Team
