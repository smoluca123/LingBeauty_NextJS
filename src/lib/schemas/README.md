# Schemas Directory

Thư mục này chứa tất cả các Zod validation schemas cho forms trong ứng dụng.

## Cấu trúc

```
schemas/
├── index.ts              # Export tất cả schemas
├── shared.schema.ts      # Shared utilities và reusable validators
├── auth.schema.ts        # Authentication forms
├── user.schema.ts        # User profile forms
├── address.schema.ts     # Address management forms
├── product.schema.ts     # Product-related forms
├── review.schema.ts      # Review forms
└── admin.schema.ts       # Admin panel forms
```

## Nguyên tắc tổ chức

1. **Tách biệt schemas và types**:
   - Schemas (validation) ở đây
   - Types (TypeScript interfaces) ở `lib/types/forms/`

2. **Sử dụng shared utilities**:
   - Tái sử dụng validators từ `shared.schema.ts`
   - Ví dụ: `requiredString()`, `phoneSchema`, `emailSchema`

3. **Đặt tên rõ ràng**:
   - Schema: `loginSchema`, `registerSchema`
   - Type: `LoginFormValues`, `RegisterFormValues`

## Cách sử dụng

```typescript
// Import schema và type
import { loginSchema } from '@/lib/schemas';
import type { LoginFormValues } from '@/lib/types/forms';

// Sử dụng với react-hook-form
const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { ... }
});
```

## Migration từ cấu trúc cũ

Cấu trúc cũ: `lib/zod-schemas/auth.schema.ts`

```typescript
export const loginSchema = z.object({ ... });
export type LoginValues = z.infer<typeof loginSchema>;
```

Cấu trúc mới:

- Schema: `lib/schemas/auth.schema.ts`
- Type: `lib/types/forms/auth.types.ts`

```typescript
// lib/schemas/auth.schema.ts
export const loginSchema = z.object({ ... });

// lib/types/forms/auth.types.ts
export interface LoginFormValues { ... }
```

## Lợi ích

1. **Tách biệt concerns**: Validation logic riêng, type definitions riêng
2. **Dễ maintain**: Tìm và sửa schemas dễ dàng hơn
3. **Reusability**: Shared validators tránh duplicate code
4. **Type safety**: Types rõ ràng, không phụ thuộc vào z.infer
5. **Better organization**: Schemas được nhóm theo domain
