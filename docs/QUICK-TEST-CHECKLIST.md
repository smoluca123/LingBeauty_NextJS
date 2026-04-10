# ✅ CHECKLIST TEST NHANH - 15 PHÚT

## 🚀 Chuẩn bị

```bash
cd client
npm run dev
```

Mở: http://localhost:3000

---

## 1️⃣ Test Brands Link (2 phút)

- [ ] Vào trang chủ
- [ ] Scroll xuống "Thương hiệu"
- [ ] Click vào 1 logo brand
- [ ] ✅ Phải vào trang `/collections/[slug]` (KHÔNG 404)

---

## 2️⃣ Test "Xem Thêm Ưu Đãi" (1 phút)

- [ ] Vào trang chủ
- [ ] Scroll xuống "Top Sản Phẩm Bán Chạy"
- [ ] Click nút "Xem thêm ưu đãi" (màu hồng)
- [ ] ✅ Phải vào trang `/products?sortBy=hot`

---

## 3️⃣ Test Flash Sale Text (2 phút)

- [ ] Vào trang chủ
- [ ] Scroll xuống "Flash Sale"
- [ ] Nhìn thanh progress bar
- [ ] ✅ Text "còn X sản phẩm" phải màu TRẮNG, dễ đọc

---

## 4️⃣ Test Header Mobile (3 phút)

- [ ] F12 → Toggle device (Ctrl+Shift+M)
- [ ] Chọn iPhone SE (375px)
- [ ] Nhìn header
- [ ] ✅ Menu button, logo, icons không bị sát nhau
- [ ] ✅ Dễ tap, không tap nhầm

---

## 5️⃣ Test Console Clean (2 phút)

- [ ] F12 → Console tab
- [ ] Navigate qua: Home → Products → Product Detail
- [ ] ✅ KHÔNG có console.log messages
- [ ] ✅ Console sạch (chỉ có warnings/errors hợp lệ)

---

## 6️⃣ Test Error Boundary (3 phút)

- [ ] Vào bất kỳ page nào
- [ ] F12 → Console
- [ ] Paste: `throw new Error('Test')`
- [ ] ✅ Hiển thị error page (không blank)
- [ ] ✅ Có nút "Thử lại" và "Về trang chủ"

---

## 7️⃣ Test Performance (2 phút)

- [ ] F12 → Lighthouse tab
- [ ] Run audit
- [ ] ✅ Performance > 80
- [ ] ✅ Accessibility > 90

---

## ✅ DONE!

**Nếu tất cả pass → Ready for QA! 🎉**

**Nếu có fail → Report bug theo template trong MANUAL-TESTING-GUIDE.md**

---

## 📱 Bonus: Test Responsive (5 phút thêm)

### Desktop (1920px)

- [ ] Layout đẹp, không bị vỡ

### Tablet (768px)

- [ ] Product grid 2-3 columns

### Mobile (375px)

- [ ] Header mobile OK
- [ ] Buttons dễ tap
- [ ] Không scroll ngang

---

**Total time: 15-20 phút**

**Tip:** Test trên Chrome/Edge, có DevTools mở sẵn!
