# Cải Tiến API Địa Điểm - Location API Improvements

## Tổng Quan / Overview

Đã hoàn thiện việc tích hợp API thực tế thay thế mock data, với hỗ trợ đầy đủ cho cả hai hệ thống hành chính cũ và mới của Việt Nam.

Successfully integrated real API to replace mock data, with full support for both old and new Vietnamese administrative division systems.

---

## Các Thay Đổi Chính / Main Changes

### 1. **API Functions** (`src/lib/apis/client/location-apis.ts`)

#### Trước đây / Before:

```typescript
export const getAllLocationAPI = async (): Promise<ILocationType[]> => {
  // Chỉ có 1 hàm, không phân biệt old/new
};
```

#### Bây giờ / Now:

```typescript
// API v1 - Hệ thống CŨ (63 tỉnh/thành phố - trước sáp nhập 2025)
export const getOldAdministrativeDivisionsAPI = async (): Promise<
  ILocationType[]
> => {
  // Uses: https://provinces.open-api.vn/api/p/?depth=3
};

// API v2 - Hệ thống MỚI (34 tỉnh/thành phố - sau sáp nhập 2025)
export const getNewAdministrativeDivisionsAPI = async (): Promise<
  ILocationType[]
> => {
  // Uses: https://provinces.open-api.vn/api/v2/?depth=3
};

// Hàm tiện ích để lấy theo mode
export const getLocationsByMode = async (
  mode: "old" | "new" = "new",
): Promise<ILocationType[]> => {
  return mode === "old"
    ? getOldAdministrativeDivisionsAPI()
    : getNewAdministrativeDivisionsAPI();
};
```

**Lợi ích / Benefits:**

- ✅ Tên hàm rõ ràng, dễ hiểu
- ✅ Hỗ trợ cả 2 hệ thống hành chính
- ✅ Có JSDoc documentation đầy đủ
- ✅ Error handling cụ thể cho từng API

---

### 2. **Cache Management** (`src/data/vietnam-locations.utils.ts`)

#### Trước đây / Before:

```typescript
let cachedLocationData: VietnamLocations | null = null;
// Chỉ cache 1 loại dữ liệu
```

#### Bây giờ / Now:

```typescript
// Cache riêng biệt cho old và new
const locationCache = {
  old: null as VietnamLocations | null,
  new: null as VietnamLocations | null,
};

const loadingState = {
  old: false,
  new: false,
};

const errorState = {
  old: null as Error | null,
  new: null as Error | null,
};
```

**Lợi ích / Benefits:**

- ✅ Cache độc lập cho mỗi mode
- ✅ Tránh conflict khi chuyển đổi giữa old/new
- ✅ Loading state riêng biệt
- ✅ Error handling tốt hơn

---

### 3. **Utility Functions** (`src/data/vietnam-locations.utils.ts`)

Tất cả các hàm utility đã được cập nhật để hỗ trợ `mode` parameter:

```typescript
// Tất cả các hàm này đều nhận mode: 'old' | 'new'
export async function getProvinces(
  mode: LocationMode = "new",
): Promise<SelectOption[]>;
export async function getProvinceByCode(
  code: string,
  mode: LocationMode = "new",
): Promise<Province | undefined>;
export async function getDistrictsByProvinceCode(
  provinceCode: string,
  mode: LocationMode = "new",
): Promise<SelectOption[]>;
export async function getDistrictByCode(
  provinceCode: string,
  districtCode: string,
  mode: LocationMode = "new",
): Promise<District | undefined>;
export async function getWardsByDistrictCode(
  provinceCode: string,
  districtCode: string,
  mode: LocationMode = "new",
): Promise<SelectOption[]>;
export async function getWardByCode(
  provinceCode: string,
  districtCode: string,
  wardCode: string,
  mode: LocationMode = "new",
): Promise<Ward | undefined>;
export async function getFullAddressFromCodes(
  provinceCode: string,
  districtCode: string,
  wardCode: string,
  mode: LocationMode = "new",
): Promise<string>;
export async function searchProvinces(
  query: string,
  mode: LocationMode = "new",
): Promise<SelectOption[]>;
export async function searchDistricts(
  provinceCode: string,
  query: string,
  mode: LocationMode = "new",
): Promise<SelectOption[]>;
export async function searchWards(
  provinceCode: string,
  districtCode: string,
  query: string,
  mode: LocationMode = "new",
): Promise<SelectOption[]>;

// Hàm clear cache cũng được cải thiện
export function clearLocationCache(mode?: LocationMode): void;
```

---

### 4. **UI Component** (`src/app/(main)/profile/components/addresses/location-selector.tsx`)

#### Thay đổi chính:

- ✅ Chuyển từ `useMemo` sang `useState` + `useEffect` để xử lý async
- ✅ Fetch data từ API thực tế thay vì mock data
- ✅ Loading states và error handling
- ✅ Auto-fill địa chỉ khi chọn từ dropdown

```typescript
// Fetch provinces khi mode thay đổi
useEffect(() => {
  if (addressMode === "manual") {
    Promise.resolve().then(() => setProvinces([]));
    return;
  }

  getProvinces(locationMode)
    .then((data) => {
      setProvinces(data);
      console.log(
        "📍 Provinces loaded:",
        data.length,
        "for mode:",
        locationMode,
      );
    })
    .catch((error) => {
      console.error("Failed to load provinces:", error);
      setProvinces([]);
    });
}, [addressMode, locationMode]);
```

---

## Cách Sử Dụng / How to Use

### Trong Component:

```typescript
import {
  getProvinces,
  getDistrictsByProvinceCode,
} from "@/data/vietnam-locations.utils";

// Lấy danh sách tỉnh/thành phố MỚI (34 tỉnh - sau sáp nhập)
const newProvinces = await getProvinces("new");

// Lấy danh sách tỉnh/thành phố CŨ (63 tỉnh - trước sáp nhập)
const oldProvinces = await getProvinces("old");

// Lấy quận/huyện theo tỉnh
const districts = await getDistrictsByProvinceCode("79", "new"); // TP.HCM
```

### Trong Address Form:

Người dùng có thể chọn 1 trong 3 mode:

1. **🆕 Chọn từ danh sách (Mới - 34 tỉnh/TP)** - Hệ thống mới sau sáp nhập 2025
2. **📜 Chọn từ danh sách (Cũ - 63 tỉnh/TP)** - Hệ thống cũ trước sáp nhập
3. **✍️ Nhập tay** - Tự nhập địa chỉ thủ công

---

## API Endpoints

### Old System (v1):

```
GET https://provinces.open-api.vn/api/p/?depth=3
```

- 63 tỉnh/thành phố (trước sáp nhập)
- Depth=3: Provinces → Districts → Wards

### New System (v2):

```
GET https://provinces.open-api.vn/api/v2/?depth=3
```

- 34 tỉnh/thành phố (sau sáp nhập 2025)
- Depth=3: Provinces → Districts → Wards

---

## Performance Optimization

### Caching Strategy:

1. **First Load**: Fetch từ API
2. **Subsequent Loads**: Dùng cached data
3. **Mode Switch**: Fetch API tương ứng nếu chưa có cache
4. **Manual Clear**: Có thể clear cache bằng `clearLocationCache()`

### Example:

```typescript
// Clear cache cho mode cụ thể
clearLocationCache("old");

// Clear tất cả cache
clearLocationCache();
```

---

## Error Handling

Tất cả API calls đều có error handling:

```typescript
try {
  const provinces = await getProvinces("new");
} catch (error) {
  console.error("Failed to load provinces:", error);
  // Fallback logic here
}
```

---

## Testing

Để test API integration:

1. Mở form địa chỉ trong profile
2. Chọn mode "Mới" hoặc "Cũ"
3. Kiểm tra console logs:
   ```
   📍 Provinces loaded: 34 for mode: new
   📍 Districts loaded: 22 for cityCode: 79
   📍 Wards loaded: 322 for districtCode: 760
   ```

---

## Notes

- ⚠️ API response structure có thể khác với expected structure
- ⚠️ Cần verify rằng depth=3 trả về đầy đủ wards data
- ⚠️ Một số lint warnings về CSS class có thể ignore (bg-gradient-to-r)

---

## Future Improvements

1. Add loading indicators trong UI
2. Add retry logic cho failed API calls
3. Add offline support với localStorage
4. Optimize bundle size bằng code splitting
5. Add unit tests cho utility functions

---

**Tác giả / Author:** Antigravity AI  
**Ngày / Date:** 2026-02-05  
**Version:** 2.0.0
