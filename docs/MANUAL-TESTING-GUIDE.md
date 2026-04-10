# HƯỚNG DẪN TEST TAY - LINGBEAUTY CLIENT

**Mục đích:** Verify tất cả các fixes đã thực hiện  
**Thời gian ước tính:** 30-45 phút  
**Người test:** QA / Developer

---

## 🚀 CHUẨN BỊ

### 1. Start Development Server

```bash
cd client
npm run dev
```

### 2. Mở Browser

- Chrome hoặc Edge (recommended)
- Mở DevTools (F12)
- Mở Console tab để check errors

### 3. Test Devices

- Desktop: 1920x1080
- Tablet: 768x1024 (iPad)
- Mobile: 375x667 (iPhone SE)

**Cách test responsive:**

- F12 → Toggle device toolbar (Ctrl+Shift+M)
- Chọn device từ dropdown

---

## ✅ TEST CHECKLIST

### 🔴 CRITICAL FIXES

#### ✅ Test #1: Brands Link (404 Fix)

**Mục tiêu:** Verify brands link không còn 404

**Steps:**

1. Vào trang chủ: `http://localhost:3000`
2. Scroll xuống section "Thương hiệu"
3. Click vào BẤT KỲ logo thương hiệu nào

**Expected:**

- ✅ Navigate đến trang `/collections/[brand-slug]`
- ✅ Hiển thị danh sách sản phẩm của brand đó
- ❌ KHÔNG bị 404 error

**Screenshot location:** `tests/screenshots/brands-link.png`

---

#### ✅ Test #2: "Xem Thêm Ưu Đãi" Button

**Mục tiêu:** Verify button navigate đúng

**Steps:**

1. Vào trang chủ: `http://localhost:3000`
2. Scroll xuống section "Top Sản Phẩm Bán Chạy"
3. Click nút "Xem thêm ưu đãi" (màu hồng, ở dưới cùng section)

**Expected:**

- ✅ Navigate đến `/products?sortBy=hot`
- ✅ Hiển thị danh sách sản phẩm hot deals
- ❌ KHÔNG bị stuck (button không làm gì)

**Screenshot location:** `tests/screenshots/view-more-deals.png`

---

#### ✅ Test #3: Top Trend Mock Data

**Mục tiêu:** Verify có TODO comment trong code

**Steps:**

1. Mở file: `client/src/components/home/top-trend/data.ts`
2. Check dòng đầu file

**Expected:**

- ✅ Có comment block giải thích đây là mock data
- ✅ Có TODO comment về việc cần API
- ✅ Data vẫn hiển thị bình thường trên UI

**Note:** Đây là temporary fix, cần backend API sau này

---

### 🟠 HIGH PRIORITY FIXES

#### ✅ Test #4: Flash Sale Progress Bar Text

**Mục tiêu:** Verify text dễ đọc trên progress bar

**Steps:**

1. Vào trang chủ: `http://localhost:3000`
2. Scroll xuống section "Flash Sale"
3. Nhìn vào thanh progress bar (màu hồng)
4. Đọc text "còn X sản phẩm"

**Expected:**

- ✅ Text màu TRẮNG (không phải hồng đậm)
- ✅ Text có drop-shadow, dễ đọc
- ✅ Contrast tốt trên background hồng
- ✅ Đọc được rõ ràng cả trên mobile

**Test với nhiều trạng thái:**

- Sản phẩm còn nhiều (>50%)
- Sản phẩm sắp hết (<20%)

**Screenshot location:** `tests/screenshots/flash-sale-text.png`

---

#### ✅ Test #5: Expandable Content

**Mục tiêu:** Verify expand/collapse hoạt động smooth

**Steps:**

1. Vào bất kỳ trang chi tiết sản phẩm nào
2. Scroll xuống phần "Mô tả chi tiết"
3. Click nút "Xem thêm"
4. Click nút "Thu gọn"

**Expected:**

- ✅ Animation smooth (không giật lag)
- ✅ Gradient overlay hiển thị đúng khi thu gọn
- ✅ Nút "Xem thêm" / "Thu gọn" đổi đúng
- ✅ Content không bị cut off đột ngột

**Screenshot location:** `tests/screenshots/expandable-content.png`

---

#### ✅ Test #6: Responsive - Header Mobile

**Mục tiêu:** Verify header dễ tap trên mobile

**Steps:**

1. Chuyển sang mobile view (375px)
2. Nhìn vào header
3. Thử tap vào:
   - Menu button (3 gạch)
   - Logo
   - Search icon
   - Cart icon
   - Wishlist icon

**Expected:**

- ✅ Spacing giữa các elements đủ lớn (không bị sát nhau)
- ✅ Dễ tap, không bị tap nhầm
- ✅ Menu button cách logo ít nhất 12px
- ✅ Icons có touch target ≥ 44x44px

**Test trên:**

- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Samsung Galaxy S20 (360px)

**Screenshot location:** `tests/screenshots/header-mobile.png`

---

#### ✅ Test #7: Responsive - Product Card

**Mục tiêu:** Verify product card không bị layout shift

**Steps:**

1. Vào trang `/products`
2. Scroll qua nhiều sản phẩm
3. Chú ý:
   - Brand name
   - Product title
   - Price
   - Buttons

**Expected:**

- ✅ Brand name không bị xuống dòng (line-clamp-1)
- ✅ Product title có min-height, không shift khi load
- ✅ Tất cả cards có chiều cao đồng đều
- ✅ Text không bị overflow

**Test trên:**

- Desktop (1920px)
- Tablet (768px)
- Mobile (375px)

**Screenshot location:** `tests/screenshots/product-card.png`

---

### 🟡 MEDIUM PRIORITY FIXES

#### ✅ Test #8: Error Boundary

**Mục tiêu:** Verify error boundary catch errors

**Steps:**

1. Tạo error cố ý:
   - Vào bất kỳ page nào
   - Mở DevTools Console
   - Paste code này:

   ```javascript
   // Trigger error
   throw new Error('Test error boundary')
   ```

2. Hoặc: Sửa code tạm thời để throw error:
   ```tsx
   // Trong bất kỳ component nào
   throw new Error('Test error')
   ```

**Expected:**

- ✅ Hiển thị error page thân thiện (KHÔNG phải blank screen)
- ✅ Có nút "Thử lại"
- ✅ Có nút "Về trang chủ"
- ✅ Error được log ra console (development mode)

**Screenshot location:** `tests/screenshots/error-boundary.png`

---

#### ✅ Test #9: Loading States

**Mục tiêu:** Verify loading indicators hoạt động

**Steps:**

1. **Test Add to Cart:**
   - Vào trang sản phẩm
   - Click "Thêm vào giỏ hàng"
   - Quan sát button

2. **Test Add to Wishlist:**
   - Click icon trái tim trên product card
   - Quan sát animation

**Expected:**

- ✅ Button "Thêm vào giỏ" hiển thị spinner khi loading
- ✅ Button bị disable khi loading
- ✅ Wishlist icon có animation khi click
- ✅ Không thể click nhiều lần (prevent duplicate)

**Test với slow network:**

- DevTools → Network tab → Throttling → Slow 3G

**Screenshot location:** `tests/screenshots/loading-states.png`

---

#### ✅ Test #10: Console.log Cleanup

**Mục tiêu:** Verify không có console.log trong production

**Steps:**

1. Mở DevTools Console
2. Navigate qua nhiều pages:
   - Trang chủ
   - Trang sản phẩm
   - Trang chi tiết sản phẩm
   - Trang giỏ hàng
   - Trang profile

**Expected:**

- ✅ KHÔNG có console.log messages (ngoài warnings/errors hợp lệ)
- ✅ Console sạch sẽ
- ❌ KHÔNG có debug logs như "Form submitted:", "Data:", etc.

**Note:** Nếu thấy console.log, check xem có wrap với `NODE_ENV === 'development'` không

**Screenshot location:** `tests/screenshots/console-clean.png`

---

### 🔵 ADDITIONAL TESTS

#### ✅ Test #11: Performance Check

**Mục tiêu:** Verify performance không bị giảm

**Steps:**

1. Mở DevTools
2. Lighthouse tab
3. Run audit cho:
   - Homepage
   - Product listing page
   - Product detail page

**Expected:**

- ✅ Performance score > 80
- ✅ Accessibility score > 90
- ✅ Best Practices score > 90
- ✅ SEO score > 90

**Screenshot location:** `tests/screenshots/lighthouse.png`

---

#### ✅ Test #12: Accessibility - Keyboard Navigation

**Mục tiêu:** Verify có thể dùng keyboard navigate

**Steps:**

1. Vào trang chủ
2. KHÔNG dùng chuột
3. Chỉ dùng keyboard:
   - Tab: Di chuyển focus
   - Shift+Tab: Di chuyển focus ngược
   - Enter: Activate button/link
   - Space: Activate button
   - Escape: Close modal

**Expected:**

- ✅ Tất cả interactive elements có thể focus
- ✅ Focus order hợp lý (top → bottom, left → right)
- ✅ Focus indicator rõ ràng (outline)
- ✅ Không bị keyboard trap

**Test trên:**

- Homepage
- Product listing
- Product detail
- Cart page

**Screenshot location:** `tests/screenshots/keyboard-nav.png`

---

#### ✅ Test #13: Accessibility - Color Contrast

**Mục tiêu:** Verify contrast đạt chuẩn WCAG AA

**Steps:**

1. Install WAVE extension: https://wave.webaim.org/extension/
2. Vào các pages
3. Click WAVE icon
4. Check "Contrast" tab

**Expected:**

- ✅ Không có contrast errors
- ✅ Tất cả text có contrast ratio ≥ 4.5:1
- ✅ Large text có contrast ratio ≥ 3:1

**Screenshot location:** `tests/screenshots/contrast-check.png`

---

## 📱 RESPONSIVE TESTING

### Desktop (1920x1080)

- [ ] Header layout đúng
- [ ] Product grid 4-5 columns
- [ ] Images load đúng size
- [ ] No horizontal scroll

### Tablet (768x1024)

- [ ] Header collapse đúng
- [ ] Product grid 2-3 columns
- [ ] Touch targets đủ lớn
- [ ] Navigation menu hoạt động

### Mobile (375x667)

- [ ] Header mobile layout
- [ ] Product grid 1-2 columns
- [ ] Buttons dễ tap
- [ ] Text readable (không quá nhỏ)
- [ ] No horizontal scroll

---

## 🐛 BUG REPORT TEMPLATE

Nếu phát hiện bug, report theo format:

```markdown
## Bug: [Tên bug ngắn gọn]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**

1. Step 1
2. Step 2
3. Step 3

**Expected Result:**

- Điều gì nên xảy ra

**Actual Result:**

- Điều gì đã xảy ra

**Screenshots:**

- [Attach screenshot]

**Environment:**

- Browser: Chrome 120
- Device: Desktop / Mobile
- Screen size: 1920x1080
- OS: Windows 11

**Console Errors:**
```

[Paste console errors nếu có]

```

**Additional Notes:**
- Bất kỳ thông tin thêm nào
```

---

## ✅ SIGN-OFF CHECKLIST

Sau khi test xong, check lại:

### Critical Fixes

- [ ] #1: Brands link works
- [ ] #2: "Xem thêm ưu đãi" button works
- [ ] #3: Top Trend có TODO comment

### High Priority Fixes

- [ ] #4: Flash sale text readable
- [ ] #5: Expandable content smooth
- [ ] #6: Header mobile spacing good
- [ ] #7: Product card no layout shift

### Medium Priority Fixes

- [ ] #8: Error boundary works
- [ ] #9: Loading states work
- [ ] #10: No console.logs

### Additional Tests

- [ ] #11: Performance good (Lighthouse > 80)
- [ ] #12: Keyboard navigation works
- [ ] #13: Color contrast passes

### Responsive Tests

- [ ] Desktop (1920px) ✓
- [ ] Tablet (768px) ✓
- [ ] Mobile (375px) ✓

---

## 📊 TEST REPORT TEMPLATE

```markdown
# TEST REPORT - LINGBEAUTY CLIENT

**Date:** [Date]
**Tester:** [Your name]
**Build:** [Commit hash or version]

## Summary

- Total tests: 13
- Passed: X
- Failed: Y
- Blocked: Z

## Test Results

### Critical Fixes (3/3)

- [x] #1: Brands link - PASS
- [x] #2: View more deals button - PASS
- [x] #3: Top Trend TODO - PASS

### High Priority Fixes (4/4)

- [x] #4: Flash sale text - PASS
- [x] #5: Expandable content - PASS
- [x] #6: Header mobile - PASS
- [x] #7: Product card - PASS

### Medium Priority Fixes (3/3)

- [x] #8: Error boundary - PASS
- [x] #9: Loading states - PASS
- [x] #10: Console cleanup - PASS

### Additional Tests (3/3)

- [x] #11: Performance - PASS (Score: 85)
- [x] #12: Keyboard nav - PASS
- [x] #13: Color contrast - PASS

## Issues Found

[List any bugs found]

## Recommendations

[Any suggestions for improvement]

## Sign-off

- [ ] Ready for production
- [ ] Needs fixes
- [ ] Blocked

**Tester Signature:** ******\_\_\_******
**Date:** ******\_\_\_******
```

---

## 🎯 QUICK TEST (15 phút)

Nếu không có thời gian test hết, ưu tiên test này:

1. ✅ Brands link (2 phút)
2. ✅ "Xem thêm ưu đãi" button (1 phút)
3. ✅ Flash sale text contrast (2 phút)
4. ✅ Header mobile spacing (3 phút)
5. ✅ Console.log check (2 phút)
6. ✅ Error boundary (3 phút)
7. ✅ Lighthouse audit (2 phút)

**Total: 15 phút**

---

## 📞 SUPPORT

Nếu gặp vấn đề khi test:

1. Check console errors
2. Check network tab (failed requests?)
3. Try hard refresh (Ctrl+Shift+R)
4. Clear cache and cookies
5. Try incognito mode

**Contact:**

- Frontend Team: [Slack channel]
- Tech Lead: [Name]

---

**Good luck testing! 🚀**

**Remember:** Test kỹ trên mobile, đó là nơi user dùng nhiều nhất!
