# Vietnamese Provinces Hook

## Overview

Custom React hook to fetch Vietnamese provinces, districts, and wards data from the [Province Open API](https://provinces.open-api.vn).

## Features

- ✅ **Version Support**: Choose between v1 (before 07/2025 merger) or v2 (after 07/2025 merger)
- ✅ **Smart Caching**: Uses localStorage to cache data for 7 days (separate cache for each version)
- ✅ **Type-Safe**: Full TypeScript support with discriminated unions
- ✅ **Loading & Error States**: Built-in state management
- ✅ **Fallback**: Uses cached data even if API fails after initial load

## API Versions

### v1 - Before Administrative Merger (Before 07/2025)

**3-level structure**: Province → District → Ward

- **Endpoint**: `https://provinces.open-api.vn/api/v1/?depth=3`
- **Use case**: Legacy data, historical records

### v2 - After Administrative Merger (After 07/2025) ⭐ Default

**2-level structure**: Province → Ward (districts removed)

- **Endpoint**: `https://provinces.open-api.vn/api/v2/?depth=3`
- **Use case**: Current data, new addresses

## Technical Implementation

- **HTTP Client**: Uses `ky` for type-safe HTTP requests
- **API Source**: Backend API (`/provinces/v1` and `/provinces/v2`) instead of third-party
- **No Data Transformation**: Returns API response directly (no mapping/transformation)
- **Cache Strategy**: Separate localStorage cache per version (7 days)
- **Type Guards**: `isProvinceV1()` and `isProvinceV2()` for discriminating between formats

## Usage

### Basic Usage (Default v2)

```tsx
import { useVietnameseProvinces } from '@/hooks/useVietnameseProvinces';

function MyComponent() {
  const { provinces, loading, error, version } = useVietnameseProvinces();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select>
      {provinces.map((province) => (
        <option key={province.code} value={province.name}>
          {province.name}
        </option>
      ))}
    </select>
  );
}
```

### Use v1 (Legacy Data)

```tsx
const { provinces } = useVietnameseProvinces({ version: 'v1' });
```

### Dynamic Version Selection

```tsx
function AddressForm() {
  const [apiVersion, setApiVersion] = useState<ApiVersion>('v2');
  const { provinces } = useVietnameseProvinces({ version: apiVersion });

  return (
    <>
      <div>
        <button onClick={() => setApiVersion('v1')}>Before 07/2025</button>
        <button onClick={() => setApiVersion('v2')}>After 07/2025</button>
      </div>

      <select>
        {provinces.map((province) => (
          <option key={province.code} value={province.name}>
            {province.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

### Working with Districts and Wards

#### V1 (3-level):

```tsx
import {
  useVietnameseProvinces,
  isProvinceV1,
} from '@/hooks/useVietnameseProvinces';

const { provinces } = useVietnameseProvinces({ version: 'v1' });
const selectedProvince = provinces[0];

if (isProvinceV1(selectedProvince)) {
  // TypeScript knows this has districts
  const districts = selectedProvince.districts;
  const wards = districts[0].wards;
}
```

#### V2 (2-level):

```tsx
import {
  useVietnameseProvinces,
  isProvinceV2,
} from '@/hooks/useVietnameseProvinces';

const { provinces } = useVietnameseProvinces({ version: 'v2' });
const selectedProvince = provinces[0];

if (isProvinceV2(selectedProvince)) {
  // TypeScript knows this has wards directly
  const wards = selectedProvince.wards;
}
```

## Data Structure

### V1 Format (3-level)

```typescript
interface ProvinceV1 {
  name: string;
  code: number; // Unique code
  codename: string; // URL-friendly name
  division_type: string; // e.g., "tỉnh", "thành phố trung ương"
  phone_code: number; // Phone area code
  districts: District[]; // ✅ Has districts
}

interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string; // e.g., "huyện", "quận"
  province_code: number;
  wards: Ward[];
}

interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string; // e.g., "xã", "phường"
  short_codename: string;
}
```

**Example v1 data:**

```json
{
  "name": "Thành phố Hà Nội",
  "code": 1,
  "codename": "thanh_pho_ha_noi",
  "division_type": "tỉnh",
  "phone_code": 24,
  "districts": [
    {
      "name": "Quận Ba Đình",
      "code": 1,
      "codename": "quan_ba_dinh",
      "division_type": "huyện",
      "province_code": 1,
      "wards": [...]
    }
  ]
}
```

### V2 Format (2-level)

```typescript
interface ProvinceV2 {
  name: string;
  code: number; // Unique code
  codename: string; // URL-friendly name
  division_type: string; // e.g., "tỉnh", "thành phố trung ương"
  phone_code: number; // Phone area code
  wards: Ward[]; // ✅ Wards directly, NO districts
}

interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string; // e.g., "xã", "phường"
  short_codename: string;
}
```

**Example v2 data:**

```json
{
  "name": "Thành phố Hà Nội",
  "code": 1,
  "codename": "ha_noi",
  "division_type": "thành phố trung ương",
  "phone_code": 24,
  "wards": [
    {
      "name": "Phường Ba Đình",
      "code": 4,
      "codename": "phuong_ba_dinh",
      "division_type": "phường",
      "short_codename": "ba_dinh"
    }
  ]
}
```

## Type Guards

Use type guards to safely work with both formats:

```tsx
import { isProvinceV1, isProvinceV2 } from '@/hooks/useVietnameseProvinces';

const province = provinces[0];

if (isProvinceV1(province)) {
  // TypeScript knows: province.districts exists
  console.log(province.districts);
}

if (isProvinceV2(province)) {
  // TypeScript knows: province.wards exists (no districts)
  console.log(province.wards);
}
```

## Cache Management

### Cache Keys

- **v1**: `vietnam_provinces_cache_v1`, `vietnam_provinces_cache_expiry_v1`
- **v2**: `vietnam_provinces_cache_v2`, `vietnam_provinces_cache_expiry_v2`

### Cache Duration

7 days (604,800,000 milliseconds)

### Clear Cache

```javascript
// Clear v1 cache
localStorage.removeItem('vietnam_provinces_cache_v1');
localStorage.removeItem('vietnam_provinces_cache_expiry_v1');

// Clear v2 cache
localStorage.removeItem('vietnam_provinces_cache_v2');
localStorage.removeItem('vietnam_provinces_cache_expiry_v2');
```

## Error Handling

The hook automatically:

1. Returns cached data if API fails
2. Sets error state with descriptive message
3. Logs errors to console for debugging

```tsx
const { provinces, error } = useVietnameseProvinces();

if (error) {
  console.error('Failed to load provinces:', error);
  // Provinces might still have cached data
}
```

## Notes

- The hook uses `localStorage`, so it only works in browser environments
- Cache is version-specific - switching versions will trigger a new fetch
- Uses `ky` instead of `fetch` for better error handling
- No data transformation - API response is used directly
