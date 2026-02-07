# Tóm tắt sửa đổi Hook Location Data

## Vấn đề ban đầu

Có sự nhầm lẫn về cấu trúc dữ liệu địa danh Việt Nam:

### **vietnam-locations-old.json** (Cấu trúc 3 cấp):

```
Province → Districts → Wards
Tỉnh/TP → Quận/Huyện → Phường/Xã
```

### **vietnam-locations-new.json** (Cấu trúc 2 cấp):

```
Province → Wards
Tỉnh/TP → Phường/Xã (trực tiếp, không có Quận/Huyện)
```

Hook cũ đang giả định cả 2 file đều có cấu trúc 3 cấp, dẫn đến lỗi khi sử dụng file `new`.

## Giải pháp đã thực hiện

### 1. **Cập nhật Types** (`vietnam-locations.types.ts`)

- Tạo types riêng cho cấu trúc cũ: `ProvinceOld`, `DistrictOld`, `WardOld`
- Tạo types riêng cho cấu trúc mới: `ProvinceNew`, `WardNew`
- Tạo union types để hỗ trợ cả 2: `Province`, `Ward`, `District`

### 2. **Sửa Utils** (`vietnam-locations.utils.ts`)

- Thêm type guards: `isProvinceOld()`, `isProvinceNew()`
- Cập nhật tất cả functions để xử lý cả 2 cấu trúc:
  - `getDistrictsByProvinceCode()`: Trả về wards trong mode NEW, districts trong mode OLD
  - `getWardsByDistrictCode()`: Trả về empty array trong mode NEW (không có sub-wards)
  - `getFullAddressFromCodes()`: Xử lý format khác nhau cho 2 modes
  - Các search functions cũng được cập nhật tương tự

### 3. **Cập nhật Hook** (`use-location-data.ts`)

- Thêm flag `isNewStructure` vào return type
- Thêm documentation rõ ràng về cách hoạt động của hook:
  - **NEW mode**: `districts` chứa wards, `wards` luôn empty
  - **OLD mode**: `districts` chứa districts, `wards` chứa wards

### 4. **Cập nhật Components**

- **LocationSelector**: Pass `isNewStructure` xuống `LocationSelectFields`
- **LocationSelectFields**:
  - Ẩn trường "Phường/Xã" khi `isNewStructure = true`
  - Cập nhật label "Quận/Huyện" thành "Quận/Huyện/Phường/Xã" trong NEW mode

## Kết quả

✅ Hỗ trợ đầy đủ cả 2 cấu trúc dữ liệu
✅ UI tự động điều chỉnh theo mode được chọn
✅ Code rõ ràng, có documentation đầy đủ
✅ Type-safe với TypeScript

## Cách sử dụng

### Mode NEW (2 cấp):

1. Chọn Tỉnh/Thành phố
2. Chọn Phường/Xã (hiển thị trong dropdown "Quận/Huyện/Phường/Xã")
3. Không có trường thứ 3

### Mode OLD (3 cấp):

1. Chọn Tỉnh/Thành phố
2. Chọn Quận/Huyện
3. Chọn Phường/Xã

## Files đã sửa

1. `vietnam-locations.types.ts` - Thêm types mới cho cả 2 cấu trúc
2. `vietnam-locations.utils.ts` - Viết lại toàn bộ logic với type guards
3. `use-location-data.ts` - Thêm flag isNewStructure và documentation
4. `use-address-auto-fill.ts` - Cập nhật logic auto-fill cho cả 2 modes
5. `location-selector.tsx` - Pass flag xuống component
6. `location-select-fields.tsx` - Ẩn field và cập nhật labels

## Chi tiết thay đổi Auto-fill Hook

### Mode NEW (2 cấp):

- `cityCode` → auto-fill `city` name
- `districtCode` (thực chất là ward code) → auto-fill `district` name
- `wardCode` → không sử dụng (empty)

### Mode OLD (3 cấp):

- `cityCode` → auto-fill `city` name
- `districtCode` → auto-fill `district` name
- `wardCode` → auto-fill `ward` name
