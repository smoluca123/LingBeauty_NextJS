# Type Safety với Discriminated Union

## Cấu trúc Type mới

```typescript
// Base interface với các field chung
interface ICategoryBase {
  id: string;
  name: string;
  slug: string;
  // ... các field khác
  children: ICategoryDataType[];
}

// Brand category - brand field BẮT BUỘC
interface IBrandCategory extends ICategoryBase {
  type: 'BRAND';
  brand: IBrandDataType; // Không null!
}

// Regular category - brand field là null
interface IRegularCategory extends ICategoryBase {
  type: 'CATEGORY';
  brand: null; // Luôn null!
}

// Discriminated union
export type ICategoryDataType = IBrandCategory | IRegularCategory;
```

## Lợi ích Type Safety

### ✅ TypeScript tự động narrow type

```typescript
function handleCategory(category: ICategoryDataType) {
  if (category.type === 'BRAND') {
    // TypeScript biết category là IBrandCategory
    // brand field KHÔNG BAO GIỜ null
    console.log(category.brand.name); // ✅ OK - không cần optional chaining
    console.log(category.brand.slug); // ✅ OK
  } else {
    // TypeScript biết category là IRegularCategory
    // brand field LUÔN LUÔN null
    console.log(category.brand); // null
  }
}
```

### ❌ Trước đây (không type-safe)

```typescript
interface ICategoryDataType {
  type: string;
  brand?: IBrandDataType | null; // Có thể null hoặc undefined
}

// Phải dùng optional chaining mọi lúc
console.log(category.brand?.name); // ❌ Không chắc chắn
```

### ✅ Bây giờ (type-safe)

```typescript
// TypeScript enforce type checking
if (item.type === 'BRAND') {
  // Không cần optional chaining!
  return <Link href={item.brand.slug}>{item.brand.name}</Link>;
}
```

## Ví dụ thực tế trong code

```tsx
{
  category.children.map((item) => {
    if (item.type === 'BRAND') {
      // TypeScript biết item.brand là IBrandDataType
      // Không cần item.brand?.id, item.brand?.slug, item.brand?.name
      return (
        <DropdownMenuItem key={item.brand.id} asChild>
          <Link href={item.brand.slug}>{item.brand.name}</Link>
        </DropdownMenuItem>
      );
    }

    // TypeScript biết item.brand là null
    return (
      <DropdownMenuItem key={item.name} asChild>
        <Link href={item.slug}>{item.name}</Link>
      </DropdownMenuItem>
    );
  });
}
```

## Compile-time Safety

TypeScript sẽ báo lỗi nếu:

```typescript
// ❌ Lỗi: brand có thể null khi type là 'CATEGORY'
const category: ICategoryDataType = {
  type: 'CATEGORY',
  brand: { id: '1', name: 'Test' }, // Error!
};

// ❌ Lỗi: brand không thể null khi type là 'BRAND'
const category: ICategoryDataType = {
  type: 'BRAND',
  brand: null, // Error!
};

// ✅ Đúng
const brandCategory: ICategoryDataType = {
  type: 'BRAND',
  brand: { id: '1', name: 'Nike', slug: '/nike' },
};

// ✅ Đúng
const regularCategory: ICategoryDataType = {
  type: 'CATEGORY',
  brand: null,
};
```

## Best Practices

1. **Luôn check type trước khi access brand**

   ```typescript
   if (category.type === 'BRAND') {
     // Safe to access category.brand
   }
   ```

2. **Không cần optional chaining sau khi check type**

   ```typescript
   // ❌ Không cần
   if (category.type === 'BRAND') {
     console.log(category.brand?.name);
   }

   // ✅ Tốt hơn
   if (category.type === 'BRAND') {
     console.log(category.brand.name);
   }
   ```

3. **TypeScript sẽ catch bugs compile-time thay vì runtime**
   - Không có null/undefined errors
   - IDE autocomplete chính xác
   - Refactoring an toàn hơn

## Kết luận

Discriminated union giúp:

- ✅ Type safety tốt hơn
- ✅ Ít bugs hơn
- ✅ Code dễ đọc hơn
- ✅ IDE support tốt hơn
- ✅ Refactoring dễ dàng hơn
