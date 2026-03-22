# Form Types Directory

Thư mục này chứa tất cả TypeScript types/interfaces cho forms trong ứng dụng.

## Cấu trúc

```
forms/
├── index.ts           # Export tất cả types
├── auth.types.ts      # Authentication form types
├── user.types.ts      # User profile form types
├── address.types.ts   # Address form types
├── product.types.ts   # Product form types
├── review.types.ts    # Review form types
└── admin.types.ts     # Admin panel form types
```

## Nguyên tắc

1. **Explicit types**: Định nghĩa rõ ràng thay vì dùng `z.infer`
2. **Naming convention**: `*FormValues` cho form data types
3. **Documentation**: Comment mô tả purpose của từng type
4. **Reusability**: Tái sử dụng types khi có thể

## Cách sử dụng

```typescript
import type { LoginFormValues, RegisterFormValues } from '@/lib/types/forms';

// Sử dụng trong component
const form = useForm<LoginFormValues>({ ... });

// Sử dụng trong function
function handleSubmit(data: LoginFormValues) { ... }
```

## So sánh với cấu trúc cũ

### Cũ (trong schema file)

```typescript
// lib/zod-schemas/auth.schema.ts
export const loginSchema = z.object({ ... });
export type LoginValues = z.infer<typeof loginSchema>;
```

### Mới (tách riêng)

```typescript
// lib/schemas/auth.schema.ts
export const loginSchema = z.object({ ... });

// lib/types/forms/auth.types.ts
export interface LoginFormValues { ... }
```

## Lợi ích

1. **Independence**: Types không phụ thuộc vào Zod
2. **Clarity**: Dễ đọc và hiểu hơn interfaces
3. **Flexibility**: Có thể extend/modify types dễ dàng
4. **Performance**: Không cần import Zod khi chỉ cần types
