# Blog Comment API - Quick Reference

## User Object Structure

Tất cả các response trả về user object với cấu trúc đầy đủ sau:

```typescript
{
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  username: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  isVerified: boolean
  isBanned: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  emailVerifiedAt?: Date
  phoneVerifiedAt?: Date
  avatar?: {
    id: string
    userId: string
    mediaId: string
    createdAt: Date
    updatedAt: Date
    media: {
      id: string
      url: string
      type: string
      mimetype: string
    }
  }
  roleAssignments?: Array<{
    id: string
    userId: string
    roleId: string
    createdAt: Date
    updatedAt: Date
    role: {
      id: string
      name: 'CLIENT' | 'ADMINISTRATOR' | 'AGENCY' | 'COLLABORATOR'
      createdAt: Date
      updatedAt: Date
    }
  }>
}
```

## API Endpoints Summary

### Public Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/api/blog-comment`     | Lấy danh sách comments |
| GET    | `/api/blog-comment/:id` | Lấy chi tiết comment   |

### Protected Endpoints (Require Auth)

| Method | Endpoint                   | Description      |
| ------ | -------------------------- | ---------------- |
| POST   | `/api/blog-comment`        | Tạo comment mới  |
| PATCH  | `/api/blog-comment/:id`    | Cập nhật comment |
| DELETE | `/api/blog-comment/:id`    | Xóa comment      |
| POST   | `/api/blog-comment-report` | Báo cáo comment  |

### Admin Endpoints (Require Admin Role)

| Method | Endpoint                                     | Description                |
| ------ | -------------------------------------------- | -------------------------- |
| GET    | `/api/admin/blog-comment-report`             | Lấy tất cả reports         |
| GET    | `/api/admin/blog-comment-report/:id`         | Lấy chi tiết report        |
| PATCH  | `/api/admin/blog-comment-report/:id/status`  | Cập nhật trạng thái report |
| DELETE | `/api/admin/blog-comment-report/comment/:id` | Xóa comment (admin)        |

## Comment Response Structure

```typescript
{
  id: string
  postId: string
  userId: string
  parentId?: string
  content: string
  createdAt: Date
  updatedAt: Date
  user: UserObject  // Full user object như trên
  replies?: Array<CommentObject>  // Nested replies
}
```

## Report Response Structure

```typescript
{
  id: string
  commentId: string
  reporterId: string
  reason: 'SPAM' | 'INAPPROPRIATE' | 'HARASSMENT' | 'MISINFORMATION' | 'OTHER'
  description?: string
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'REJECTED'
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
  reporter: UserObject  // Full user object
  reviewer?: UserObject  // Full user object
  comment: {
    id: string
    content: string
    postId: string
  }
}
```

## Frontend Usage

```typescript
// Import types
import type {
  IBlogCommentDataType,
  IUserDataType,
} from '@/lib/types/interfaces/apis'

// Use hooks
const { data } = useBlogCommentsQuery({ postId: 'xxx' })

// Access user data
const comment: IBlogCommentDataType = data.data.items[0]
const user: IUserDataType = comment.user
const avatar = user.avatar?.media.url
const fullName = `${user.firstName} ${user.lastName}`
```

## Important Notes

1. **User Object**: Luôn trả về full user object với avatar và roleAssignments
2. **Nested Replies**: Comments có thể có nested replies với cùng structure
3. **Soft Delete**: Comments bị xóa sẽ soft delete, không hiển thị trong queries
4. **Permissions**: User chỉ có thể sửa/xóa comments của mình, admin có thể xóa bất kỳ comment nào

Xem file `BLOG-COMMENT-API.md` để biết chi tiết đầy đủ về từng endpoint.
