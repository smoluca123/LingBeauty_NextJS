# Blog Image Upload Fix

## Issue

Khi update ảnh cho blog topic hoặc blog post, gặp lỗi:

```
Invalid input: expected string, received File
```

## Root Cause

1. **Zod Schema Issue:** Schema định nghĩa field `image` và `featuredImage` là `string`, nhưng `ImageUploadDropzone` component trả về `File` object khi user chọn file mới.

2. **Form Submission Issue:** Form đang submit cả `File` object trong data payload, nhưng API không accept File trực tiếp - cần upload qua FormData riêng.

## Solution

### 1. Updated Zod Schemas

**File:** `client/src/lib/schemas/blog.schema.ts`

Changed from:

```typescript
image: z.string().optional()
featuredImage: z.string().optional()
```

To:

```typescript
image: z.union([z.string(), z.instanceof(File)]).optional()
featuredImage: z.union([z.string(), z.instanceof(File)]).optional()
```

This allows the schema to accept both:

- `string` - URL của ảnh hiện tại
- `File` - File object khi user chọn ảnh mới

### 2. Updated Blog Topic Form

**File:** `client/src/app/admin/blog/components/topics/blog-topic-form.tsx`

#### Changes:

1. **Added state for file:**

```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null)
```

2. **Added upload mutation:**

```typescript
const uploadImageMutation = useUploadTopicImageMutation()
```

3. **Updated submit logic:**

```typescript
const onSubmit = async (data: BlogTopicFormValues) => {
  // Remove image from data
  const { image, ...topicData } = data

  let topicId = topic?.id

  // Create or update topic first
  if (isEdit) {
    await updateMutation.mutateAsync({ id: topic.id, data: topicData })
  } else {
    const result = await createMutation.mutateAsync(topicData)
    topicId = result.data.id
  }

  // Upload image separately if selected
  if (selectedFile && topicId) {
    const formData = new FormData()
    formData.append('file', selectedFile)
    await uploadImageMutation.mutateAsync({ id: topicId, formData })
  }

  onClose()
}
```

4. **Updated image field:**

```typescript
<ImageUploadDropzone
  value={
    selectedFile
      ? URL.createObjectURL(selectedFile)
      : topic?.imageMedia?.url || null
  }
  onChange={(newValue) => {
    if (newValue instanceof File) {
      setSelectedFile(newValue)
      onChange(newValue)
    } else if (typeof newValue === 'string') {
      setSelectedFile(null)
      onChange(newValue)
    } else {
      setSelectedFile(null)
      onChange(null)
    }
  }}
  label="Hình ảnh chủ đề"
  maxSize={5}
/>
```

5. **Updated isPending:**

```typescript
const isPending =
  createMutation.isPending ||
  updateMutation.isPending ||
  uploadImageMutation.isPending
```

### 3. Updated Blog Post Form

**File:** `client/src/app/admin/blog/components/posts/blog-post-form.tsx`

Applied the same changes as Blog Topic Form:

- Added `selectedFile` state
- Added `useUploadPostFeaturedImageMutation()`
- Separated image upload logic from form submission
- Updated `featuredImage` field handler
- Updated `isPending` to include upload mutation

## How It Works Now

### Flow for Creating New Topic/Post with Image:

1. User fills form and selects image
2. Image File is stored in `selectedFile` state
3. On submit:
   - Create topic/post first (without image)
   - Get the new ID from response
   - Upload image separately using FormData
   - Both mutations invalidate cache
4. UI updates with new topic/post including image

### Flow for Editing Existing Topic/Post:

1. Form loads with existing data
2. If user selects new image:
   - New File stored in `selectedFile`
   - Preview shows using `URL.createObjectURL()`
3. On submit:
   - Update topic/post data first
   - If new image selected, upload it
   - Cache invalidated
4. UI updates

### Flow for Keeping Existing Image:

1. User doesn't select new image
2. `selectedFile` remains `null`
3. On submit:
   - Only update topic/post data
   - No image upload call
4. Existing image URL preserved

## Benefits

✅ **Proper Separation of Concerns:**

- Form data submission separate from file upload
- Follows backend API design (separate endpoints)

✅ **Better Error Handling:**

- Can handle form validation errors separately from upload errors
- User gets specific feedback for each operation

✅ **Consistent with Project Patterns:**

- Matches how other forms handle image upload (banner, product)
- Uses FormData for file uploads
- Proper mutation chaining

✅ **Type Safety:**

- Zod schema properly validates both string URLs and File objects
- TypeScript catches type mismatches

✅ **Better UX:**

- Shows preview of selected image immediately
- Loading states for both operations
- Proper error messages

## Testing Checklist

- [x] Create new topic with image
- [x] Create new topic without image
- [x] Edit topic and change image
- [x] Edit topic without changing image
- [x] Create new post with featured image
- [x] Create new post without featured image
- [x] Edit post and change featured image
- [x] Edit post without changing featured image
- [x] Verify image preview works
- [x] Verify loading states
- [x] Verify error handling

## Related Files Modified

1. `client/src/lib/schemas/blog.schema.ts` - Updated schemas
2. `client/src/app/admin/blog/components/topics/blog-topic-form.tsx` - Fixed topic form
3. `client/src/app/admin/blog/components/posts/blog-post-form.tsx` - Fixed post form

## No Changes Needed

- API functions (already correct)
- Mutations (already have upload mutations)
- Route handlers (already correct)
- Backend integration (already correct)

The issue was purely in the form handling logic and schema validation.
