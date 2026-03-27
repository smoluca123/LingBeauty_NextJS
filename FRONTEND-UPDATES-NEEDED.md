# Frontend Updates Needed - Default Variant Model

## ✅ Completed

### 1. Utility Functions (`lib/utils/variant-utils.ts`)

- ✅ `isDefaultVariant()` - Check if variant is default
- ✅ `hasOnlyDefaultVariant()` - Check if product only has default variant
- ✅ `getNonDefaultVariants()` - Get non-default variants
- ✅ `getDisplayVariants()` - Get variants to display (hide default if only one)
- ✅ `shouldShowVariantSelector()` - Check if should show variant selector
- ✅ `getDefaultVariant()` - Get default variant from list

### 2. Add to Cart Button (`components/cart/add-to-cart-button.tsx`)

- ✅ Use `getDisplayVariants()` to filter variants
- ✅ Use `hasOnlyDefaultVariant()` to detect simple products
- ✅ Hide default variant if it's the only one
- ✅ Omit variantId for simple products (backend auto-selects)

### 3. Add to Cart Dialog (`components/cart/add-to-cart-dialog.tsx`)

- ✅ Use `getDisplayVariants()` to filter variants
- ✅ Only show actual variants (not default)

---

## ⏳ In Progress

### 4. Product Detail Page (`app/(main)/products/[slug]/components/product-detail-info.tsx`)

**Current Issues:**

- Uses all variants including default
- Doesn't hide default variant for simple products
- Inventory logic needs update

**Changes Needed:**

```typescript
// Use display variants
const displayVariants = getDisplayVariants(product.variants)
const isSimpleProduct = hasOnlyDefaultVariant(product.variants)

// For simple products, don't show variant selector
if (isSimpleProduct) {
  // Use product.inventory or default variant inventory
  // Don't show variant options
}

// For products with variants, show variant selector
if (displayVariants.length > 0) {
  // Show variant selector with displayVariants
}
```

### 5. Product Card (`components/product/product-card2.tsx`)

**Current Issues:**

- May show variant count including default
- Price display may need adjustment

**Changes Needed:**

```typescript
// Use display variants for count
const displayVariants = getDisplayVariants(product.variants)
const variantCount = displayVariants.length

// Show "X màu" only if has actual variants
if (variantCount > 1) {
  // Show variant count
}
```

### 6. Admin Product Forms

**Components to Check:**

- `app/admin/products/components/product-form.tsx`
- `app/admin/products/components/variant-form.tsx`
- `app/admin/flash-sales/components/flash-sale-product-form.tsx`

**Changes Needed:**

- variantId should be optional in forms
- Backend will auto-select default variant
- Show message: "Để trống để sử dụng variant mặc định"

---

## 📋 Detailed Updates

### Product Detail Info Component

**File:** `app/(main)/products/[slug]/components/product-detail-info.tsx`

**Current Logic:**

```typescript
const variants = product.variants ?? []
const hasVariants = variants.length > 0
```

**Updated Logic:**

```typescript
import {
  getDisplayVariants,
  hasOnlyDefaultVariant,
} from '@/lib/utils/variant-utils'

const displayVariants = getDisplayVariants(product.variants)
const isSimpleProduct = hasOnlyDefaultVariant(product.variants)
const hasActualVariants = displayVariants.length > 0

// For simple products
if (isSimpleProduct) {
  // Don't show variant selector
  // Use default variant inventory
  const defaultVariant = product.variants?.[0]
  const inventory = defaultVariant?.inventory
}

// For products with variants
if (hasActualVariants) {
  // Show variant selector with displayVariants
  const [selectedVariant, setSelectedVariant] = useState(displayVariants[0])
}
```

**Inventory Resolution:**

```typescript
// After migration, all products have variants
// Use variant inventory (either default or selected)
const activeVariant = isSimpleProduct
  ? product.variants?.[0] // Default variant
  : selectedVariant // Selected variant

const inventory = activeVariant?.inventory
const maxStock = inventory?.quantity ?? 0
const isOutOfStock = inventory?.displayStatus === 'OUT_OF_STOCK'
```

**Add to Cart:**

```typescript
const handleAddToCart = () => {
  if (isSimpleProduct) {
    // Omit variantId for simple products
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    })
  } else {
    // Include variantId for products with variants
    addToCartMutation.mutate({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    })
  }
}
```

### Product Card Component

**File:** `components/product/product-card2.tsx`

**Current Logic:**

```typescript
const variants = product.variants ?? []
const variantCount = variants.length
```

**Updated Logic:**

```typescript
import { getDisplayVariants } from '@/lib/utils/variant-utils'

const displayVariants = getDisplayVariants(product.variants)
const variantCount = displayVariants.length

// Only show variant indicator if has actual variants
{variantCount > 1 && (
  <span className="text-xs text-muted-foreground">
    {variantCount} màu
  </span>
)}
```

**Price Display:**

```typescript
// For simple products, use basePrice or default variant price
// For products with variants, show price range or "from" price
const isSimpleProduct = hasOnlyDefaultVariant(product.variants)

if (isSimpleProduct) {
  // Show single price
  const price = product.variants?.[0]?.price ?? product.basePrice
} else if (displayVariants.length > 0) {
  // Show price range
  const prices = displayVariants.map((v) => Number(v.price))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  if (minPrice === maxPrice) {
    // All variants same price
    formatCurrency(minPrice)
  } else {
    // Price range
    ;`${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
  }
}
```

### Admin Flash Sale Form

**File:** `app/admin/flash-sales/components/flash-sale-product-form.tsx`

**Current Logic:**

```typescript
<Select required>
  <SelectTrigger>
    <SelectValue placeholder="Chọn variant" />
  </SelectTrigger>
  <SelectContent>
    {variants.map(v => (
      <SelectItem key={v.id} value={v.id}>
        {v.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Updated Logic:**

```typescript
import { getDisplayVariants, hasOnlyDefaultVariant } from '@/lib/utils/variant-utils'

const displayVariants = getDisplayVariants(product.variants)
const isSimpleProduct = hasOnlyDefaultVariant(product.variants)

{isSimpleProduct ? (
  // Simple product - no variant selector needed
  <div className="text-sm text-muted-foreground">
    Sản phẩm đơn giản (sẽ sử dụng variant mặc định)
  </div>
) : (
  // Product with variants - show selector
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Chọn variant (tùy chọn)" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="">Tất cả variants</SelectItem>
      {displayVariants.map(v => (
        <SelectItem key={v.id} value={v.id}>
          {v.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}
```

---

## 🧪 Testing Checklist

### Simple Products (Only Default Variant)

- [ ] Product card shows single price (not variant count)
- [ ] Add to cart button works without variant selector
- [ ] Product detail page doesn't show variant selector
- [ ] Inventory displays correctly
- [ ] Add to cart works (backend auto-selects default variant)

### Products with Variants

- [ ] Product card shows variant count
- [ ] Product card shows price range if variants have different prices
- [ ] Add to cart button opens variant selector
- [ ] Product detail page shows variant selector
- [ ] Variant selector only shows actual variants (not default)
- [ ] Add to cart works with selected variant

### Admin

- [ ] Flash sale form handles simple products correctly
- [ ] Flash sale form shows variant selector for products with variants
- [ ] Can add simple product to flash sale without selecting variant
- [ ] Can add product with variants to flash sale with specific variant

---

## 🎨 UI/UX Considerations

### Simple Products

**Before (with default variant visible):**

```
Product Name
Variant: Mặc định  ← Confusing for users
Price: 100,000đ
[Add to Cart]
```

**After (default variant hidden):**

```
Product Name
Price: 100,000đ
[Add to Cart]
```

### Products with Variants

**Before:**

```
Product Name
Variants: Mặc định, Đỏ, Xanh  ← Default variant shown
Price: 100,000đ - 150,000đ
[Choose & Add to Cart]
```

**After:**

```
Product Name
Variants: Đỏ, Xanh  ← Only actual variants
Price: 100,000đ - 150,000đ
[Choose & Add to Cart]
```

---

## 📝 Code Patterns

### Check if Simple Product

```typescript
import { hasOnlyDefaultVariant } from '@/lib/utils/variant-utils'

const isSimpleProduct = hasOnlyDefaultVariant(product.variants)
```

### Get Display Variants

```typescript
import { getDisplayVariants } from '@/lib/utils/variant-utils'

const displayVariants = getDisplayVariants(product.variants)
```

### Add to Cart Logic

```typescript
// Simple product
if (isSimpleProduct) {
  addToCart({ productId, quantity }) // No variantId
}

// Product with variants
if (hasActualVariants) {
  addToCart({ productId, variantId, quantity })
}
```

### Inventory Access

```typescript
// After migration, always use variant inventory
const variant = isSimpleProduct
  ? product.variants?.[0] // Default variant
  : selectedVariant // Selected variant

const inventory = variant?.inventory
```

---

## 🚀 Deployment Plan

### Phase 1: Core Components ✅

- [x] Create variant utility functions
- [x] Update add-to-cart-button
- [x] Update add-to-cart-dialog

### Phase 2: Product Display ⏳

- [ ] Update product-detail-info
- [ ] Update product-card2
- [ ] Update product listing pages

### Phase 3: Admin ⏳

- [ ] Update flash-sale-product-form
- [ ] Update product-form
- [ ] Update variant-form

### Phase 4: Testing ⏳

- [ ] Test simple products
- [ ] Test products with variants
- [ ] Test admin forms
- [ ] Test cart flow
- [ ] Test order flow

---

## 📚 Documentation

- [x] Create variant-utils.ts with helper functions
- [x] Update add-to-cart components
- [ ] Update component documentation
- [ ] Add JSDoc comments
- [ ] Update README if needed
