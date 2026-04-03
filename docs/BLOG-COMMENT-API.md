# Blog Comment & Report API Documentation

Tài liệu API cho hệ thống bình luận blog và báo cáo bình luận.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

---

## 📝 Blog Comment APIs

### 1. Get Comments (Public)

**Endpoint:** `GET /blog-comment`

**Description:** Lấy danh sách bình luận của một bài viết blog

**Query Parameters:**

```typescript
{
  page?: number        // Trang hiện tại (default: 1)
  limit?: number       // Số items mỗi trang (default: 20)
  postId?: string      // Filter theo blog post ID
  userId?: string      // Filter theo user ID
  parentId?: string    // Filter theo parent comment ID (dùng 'null' cho top-level comments)
}
```

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    items: Array<{
      id: string
      postId: string
      userId: string
      parentId?: string
      content: string
      createdAt: Date
      updatedAt: Date
      user: {
        id: string
        username: string
        firstName: string
        lastName: string
      }
      replies?: Array<Comment> // Nested replies
    }>
    totalCount: number
    totalPage: number
    currentPage: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
```

**Example Request:**

```bash
GET /api/blog-comment?postId=123e4567-e89b-12d3-a456-426614174000&page=1&limit=20
```

**Example Response:**

```json
{
  "message": "Lấy danh sách bình luận thành công",
  "statusCode": 200,
  "date": "2024-01-15T10:30:00.000Z",
  "data": {
    "items": [
      {
        "id": "comment-uuid-1",
        "postId": "post-uuid-1",
        "userId": "user-uuid-1",
        "parentId": null,
        "content": "Great article! Very informative.",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z",
        "user": {
          "id": "user-uuid-1",
          "email": "john@example.com",
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe",
          "phone": "+1234567890",
          "isActive": true,
          "isVerified": true,
          "isBanned": false,
          "isEmailVerified": true,
          "isPhoneVerified": true,
          "emailVerifiedAt": "2024-01-01T00:00:00.000Z",
          "phoneVerifiedAt": null,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "avatar": {
            "id": "avatar-uuid-1",
            "userId": "user-uuid-1",
            "mediaId": "media-uuid-1",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z",
            "media": {
              "id": "media-uuid-1",
              "url": "https://example.com/avatar.jpg",
              "type": "AVATAR",
              "mimetype": "image/jpeg"
            }
          },
          "roleAssignments": [
            {
              "id": "role-assign-uuid-1",
              "userId": "user-uuid-1",
              "roleId": "role-uuid-1",
              "createdAt": "2024-01-01T00:00:00.000Z",
              "updatedAt": "2024-01-01T00:00:00.000Z",
              "role": {
                "id": "role-uuid-1",
                "name": "CLIENT",
                "createdAt": "2024-01-01T00:00:00.000Z",
                "updatedAt": "2024-01-01T00:00:00.000Z"
              }
            }
          ]
        },
        "replies": [
          {
            "id": "comment-uuid-2",
            "postId": "post-uuid-1",
            "userId": "user-uuid-2",
            "parentId": "comment-uuid-1",
            "content": "Thanks for sharing!",
            "createdAt": "2024-01-15T10:15:00.000Z",
            "updatedAt": "2024-01-15T10:15:00.000Z",
            "user": {
              "id": "user-uuid-2",
              "email": "jane@example.com",
              "username": "jane_smith",
              "firstName": "Jane",
              "lastName": "Smith",
              "phone": "+1234567891",
              "isActive": true,
              "isVerified": true,
              "isBanned": false,
              "isEmailVerified": true,
              "isPhoneVerified": false,
              "emailVerifiedAt": "2024-01-01T00:00:00.000Z",
              "phoneVerifiedAt": null,
              "createdAt": "2024-01-01T00:00:00.000Z",
              "updatedAt": "2024-01-01T00:00:00.000Z",
              "avatar": null,
              "roleAssignments": []
            }
          }
        ]
      }
    ],
    "totalCount": 25,
    "totalPage": 2,
    "currentPage": 1,
    "pageSize": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 2. Get Comment By ID (Public)

**Endpoint:** `GET /blog-comment/:id`

**Description:** Lấy chi tiết một bình luận cụ thể

**Path Parameters:**

- `id` (string, required): Comment ID

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    id: string
    postId: string
    userId: string
    parentId?: string
    content: string
    createdAt: Date
    updatedAt: Date
    user: {
      id: string
      username: string
      firstName: string
      lastName: string
    }
    replies?: Array<Comment>
  }
}
```

**Example Request:**

```bash
GET /api/blog-comment/comment-uuid-1
```

---

### 3. Create Comment (Protected)

**Endpoint:** `POST /blog-comment`

**Description:** Tạo bình luận mới trên bài viết blog

**Authentication:** Required (Bearer Token)

**Request Body:**

```typescript
{
  postId: string       // Required: Blog post ID
  content: string      // Required: Nội dung bình luận
  parentId?: string    // Optional: Parent comment ID (cho nested reply)
}
```

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    id: string
    postId: string
    userId: string
    parentId?: string
    content: string
    createdAt: Date
    updatedAt: Date
    user: {
      id: string
      username: string
      firstName: string
      lastName: string
    }
  }
}
```

**Example Request:**

```bash
POST /api/blog-comment
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "postId": "post-uuid-1",
  "content": "This is a great article!",
  "parentId": null
}
```

**Example Response:**

```json
{
  "message": "Tạo bình luận thành công",
  "statusCode": 201,
  "date": "2024-01-15T10:30:00.000Z",
  "data": {
    "id": "comment-uuid-new",
    "postId": "post-uuid-1",
    "userId": "user-uuid-1",
    "parentId": null,
    "content": "This is a great article!",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "user": {
      "id": "user-uuid-1",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Blog post not found
- `403 Forbidden`: Cannot comment on unpublished post

---

### 4. Update Comment (Protected)

**Endpoint:** `PATCH /blog-comment/:id`

**Description:** Cập nhật bình luận của chính mình

**Authentication:** Required (Bearer Token)

**Path Parameters:**

- `id` (string, required): Comment ID

**Request Body:**

```typescript
{
  content: string // Required: Nội dung bình luận mới
}
```

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    id: string
    postId: string
    userId: string
    parentId?: string
    content: string
    createdAt: Date
    updatedAt: Date
    user: {
      id: string
      username: string
      firstName: string
      lastName: string
    }
  }
}
```

**Example Request:**

```bash
PATCH /api/blog-comment/comment-uuid-1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not the owner of the comment
- `404 Not Found`: Comment not found

---

### 5. Delete Comment (Protected)

**Endpoint:** `DELETE /blog-comment/:id`

**Description:** Xóa bình luận của chính mình (soft delete)

**Authentication:** Required (Bearer Token)

**Path Parameters:**

- `id` (string, required): Comment ID

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    message: string
  }
}
```

**Example Request:**

```bash
DELETE /api/blog-comment/comment-uuid-1
Authorization: Bearer <access_token>
```

**Example Response:**

```json
{
  "message": "Xóa bình luận thành công",
  "statusCode": 200,
  "date": "2024-01-15T10:30:00.000Z",
  "data": {
    "message": "Xóa bình luận thành công"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not the owner of the comment
- `404 Not Found`: Comment not found

---

## 🚨 Blog Comment Report APIs

### 6. Create Comment Report (Protected)

**Endpoint:** `POST /blog-comment-report`

**Description:** Báo cáo bình luận không phù hợp lên admin

**Authentication:** Required (Bearer Token)

**Request Body:**

```typescript
{
  commentId: string                    // Required: Comment ID cần báo cáo
  reason: BlogCommentReportReason      // Required: Lý do báo cáo
  description?: string                 // Optional: Mô tả chi tiết
}

// BlogCommentReportReason enum:
enum BlogCommentReportReason {
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  HARASSMENT = 'HARASSMENT',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER'
}
```

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    id: string
    commentId: string
    reporterId: string
    reason: BlogCommentReportReason
    description?: string
    status: BlogCommentReportStatus
    reviewedBy?: string
    reviewedAt?: Date
    createdAt: Date
    updatedAt: Date
    reporter: {
      id: string
      username: string
      firstName: string
      lastName: string
    }
    comment: {
      id: string
      content: string
      postId: string
    }
  }
}
```

**Example Request:**

```bash
POST /api/blog-comment-report
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "commentId": "comment-uuid-1",
  "reason": "SPAM",
  "description": "This comment contains spam links"
}
```

**Example Response:**

```json
{
  "message": "Báo cáo bình luận thành công",
  "statusCode": 201,
  "date": "2024-01-15T10:30:00.000Z",
  "data": {
    "id": "report-uuid-1",
    "commentId": "comment-uuid-1",
    "reporterId": "user-uuid-1",
    "reason": "SPAM",
    "description": "This comment contains spam links",
    "status": "PENDING",
    "reviewedBy": null,
    "reviewedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "reporter": {
      "id": "user-uuid-1",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "comment": {
      "id": "comment-uuid-1",
      "content": "Spam content here...",
      "postId": "post-uuid-1"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Cannot report own comment
- `404 Not Found`: Comment not found
- `409 Conflict`: Already reported this comment

---

## 👨‍💼 Admin APIs

### 7. Get All Reports (Admin Only)

**Endpoint:** `GET /admin/blog-comment-report`

**Description:** Lấy danh sách tất cả báo cáo (Admin only)

**Authentication:** Required (Bearer Token + Admin Role)

**Query Parameters:**

```typescript
{
  page?: number                        // Trang hiện tại (default: 1)
  limit?: number                       // Số items mỗi trang (default: 20)
  status?: BlogCommentReportStatus     // Filter theo trạng thái
  reason?: BlogCommentReportReason     // Filter theo lý do
  commentId?: string                   // Filter theo comment ID
}

// BlogCommentReportStatus enum:
enum BlogCommentReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}
```

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    items: Array<{
      id: string
      commentId: string
      reporterId: string
      reason: BlogCommentReportReason
      description?: string
      status: BlogCommentReportStatus
      reviewedBy?: string
      reviewedAt?: Date
      createdAt: Date
      updatedAt: Date
      reporter: {
        id: string
        username: string
        firstName: string
        lastName: string
      }
      reviewer?: {
        id: string
        username: string
        firstName: string
        lastName: string
      }
      comment: {
        id: string
        content: string
        postId: string
      }
    }>
    totalCount: number
    totalPage: number
    currentPage: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
```

**Example Request:**

```bash
GET /api/admin/blog-comment-report?status=PENDING&page=1&limit=20
Authorization: Bearer <admin_access_token>
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not an admin

---

### 8. Get Report By ID (Admin Only)

**Endpoint:** `GET /admin/blog-comment-report/:id`

**Description:** Lấy chi tiết một báo cáo (Admin only)

**Authentication:** Required (Bearer Token + Admin Role)

**Path Parameters:**

- `id` (string, required): Report ID

**Response:** Same as single report object in Get All Reports

**Example Request:**

```bash
GET /api/admin/blog-comment-report/report-uuid-1
Authorization: Bearer <admin_access_token>
```

---

### 9. Update Report Status (Admin Only)

**Endpoint:** `PATCH /admin/blog-comment-report/:id/status`

**Description:** Cập nhật trạng thái báo cáo (Admin only)

**Authentication:** Required (Bearer Token + Admin Role)

**Path Parameters:**

- `id` (string, required): Report ID

**Request Body:**

```typescript
{
  status: BlogCommentReportStatus // Required: Trạng thái mới
}

// Available statuses:
// - PENDING: Đang chờ xử lý
// - REVIEWED: Đã xem xét
// - RESOLVED: Đã giải quyết
// - REJECTED: Từ chối báo cáo
```

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    id: string
    commentId: string
    reporterId: string
    reason: BlogCommentReportReason
    description?: string
    status: BlogCommentReportStatus
    reviewedBy: string
    reviewedAt: Date
    createdAt: Date
    updatedAt: Date
    reporter: { ... }
    reviewer: { ... }
    comment: { ... }
  }
}
```

**Example Request:**

```bash
PATCH /api/admin/blog-comment-report/report-uuid-1/status
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "status": "RESOLVED"
}
```

**Example Response:**

```json
{
  "message": "Cập nhật trạng thái báo cáo thành công",
  "statusCode": 200,
  "date": "2024-01-15T10:30:00.000Z",
  "data": {
    "id": "report-uuid-1",
    "commentId": "comment-uuid-1",
    "reporterId": "user-uuid-1",
    "reason": "SPAM",
    "description": "This comment contains spam links",
    "status": "RESOLVED",
    "reviewedBy": "admin-uuid-1",
    "reviewedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "reporter": {
      "id": "user-uuid-1",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "reviewer": {
      "id": "admin-uuid-1",
      "username": "admin",
      "firstName": "Admin",
      "lastName": "User"
    },
    "comment": {
      "id": "comment-uuid-1",
      "content": "Spam content here...",
      "postId": "post-uuid-1"
    }
  }
}
```

---

### 10. Delete Comment (Admin Only)

**Endpoint:** `DELETE /admin/blog-comment-report/comment/:id`

**Description:** Xóa bất kỳ bình luận nào (Admin only)

**Authentication:** Required (Bearer Token + Admin Role)

**Path Parameters:**

- `id` (string, required): Comment ID

**Response:**

```typescript
{
  message: string
  statusCode: number
  date: Date
  data: {
    message: string
  }
}
```

**Example Request:**

```bash
DELETE /api/admin/blog-comment-report/comment/comment-uuid-1
Authorization: Bearer <admin_access_token>
```

**Example Response:**

```json
{
  "message": "Xóa bình luận thành công",
  "statusCode": 200,
  "date": "2024-01-15T10:30:00.000Z",
  "data": {
    "message": "Xóa bình luận thành công"
  }
}
```

---

## 🔐 Authentication

Tất cả các protected endpoints yêu cầu Bearer Token trong header:

```bash
Authorization: Bearer <access_token>
```

Token được lấy từ cookies sau khi đăng nhập thành công.

---

## ⚠️ Error Codes

| Code       | Message                   | Description                                |
| ---------- | ------------------------- | ------------------------------------------ |
| `BLOG_006` | Blog post not found       | Bài viết blog không tồn tại                |
| `BLOG_010` | Blog post not published   | Bài viết chưa được xuất bản                |
| `BLOG_011` | Comment not found         | Bình luận không tồn tại                    |
| `BLOG_012` | Comment not owned         | Không phải chủ sở hữu bình luận            |
| `BLOG_013` | Report not found          | Báo cáo không tồn tại                      |
| `BLOG_014` | Report already exists     | Đã báo cáo bình luận này rồi               |
| `BLOG_015` | Cannot report own comment | Không thể báo cáo bình luận của chính mình |
| `AUTH_006` | Insufficient permissions  | Không đủ quyền truy cập                    |
| `SYS_001`  | Database error            | Lỗi database                               |

---

## 📚 Usage Examples

### Frontend Implementation với React Query

```typescript
// 1. Lấy comments của một bài viết
const { data, isLoading } = useBlogCommentsQuery({
  postId: 'post-uuid-1',
  page: 1,
  limit: 20,
  parentId: null, // Chỉ lấy top-level comments
})

// 2. Tạo comment mới
const createMutation = useCreateBlogCommentMutation()
createMutation.mutate({
  postId: 'post-uuid-1',
  content: 'Great article!',
  parentId: null,
})

// 3. Reply to comment
createMutation.mutate({
  postId: 'post-uuid-1',
  content: 'Thanks for sharing!',
  parentId: 'parent-comment-uuid',
})

// 4. Báo cáo comment
const reportMutation = useCreateCommentReportMutation()
reportMutation.mutate({
  commentId: 'comment-uuid-1',
  reason: 'SPAM',
  description: 'This is spam',
})

// 5. Admin: Cập nhật trạng thái báo cáo
const updateStatusMutation = useUpdateReportStatusMutation()
updateStatusMutation.mutate({
  id: 'report-uuid-1',
  status: 'RESOLVED',
})
```

---

## 📝 Notes

1. **Nested Comments**: Hệ thống hỗ trợ nested replies thông qua `parentId`. Frontend có thể render comments theo cấu trúc cây.

2. **Soft Delete**: Comments bị xóa sẽ được soft delete (đánh dấu `isDeleted = true`) thay vì xóa vĩnh viễn.

3. **Permissions**:
   - User chỉ có thể sửa/xóa comments của chính mình
   - Admin có thể xóa bất kỳ comment nào
   - Không thể báo cáo comment của chính mình
   - Không thể báo cáo cùng một comment nhiều lần

4. **Validation**:
   - Chỉ có thể comment trên published posts
   - Content không được để trống
   - Parent comment phải tồn tại và thuộc cùng post

5. **Caching**: Frontend nên cache comments và invalidate khi có thay đổi (create/update/delete).
