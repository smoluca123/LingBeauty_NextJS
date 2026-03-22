# Tiptap Editor with Image Upload

Rich text editor component với đầy đủ tính năng upload ảnh.

## Features

✅ Rich text formatting (bold, italic, underline, strikethrough, highlight)
✅ Headings (H1, H2)
✅ Lists (bullet, ordered)
✅ Text alignment (left, center, right)
✅ Links
✅ Images với 3 cách upload:

- Upload từ file picker
- Paste ảnh từ clipboard (Ctrl+V)
- Drag & drop ảnh vào editor
  ✅ Hashtags với suggestions
  ✅ Loading state khi upload
  ✅ Error handling

## Usage

### Basic Usage

```tsx
import { TiptapEditor } from "@/components/tiptap-editor";

export default function MyComponent() {
  const [content, setContent] = useState("");

  return (
    <TiptapEditor
      value={content}
      onChange={setContent}
      placeholder="Nhập nội dung..."
    />
  );
}
```

### With Custom Image Upload Handler

```tsx
import { TiptapEditor } from "@/components/tiptap-editor";

export default function MyComponent() {
  const [content, setContent] = useState("");

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/general-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.data.url;
  };

  return (
    <TiptapEditor
      value={content}
      onChange={setContent}
      onImageUpload={handleImageUpload}
    />
  );
}
```

### With Hashtag Suggestions

```tsx
import { TiptapEditor } from "@/components/tiptap-editor";

const HASHTAGS = ["beauty", "skincare", "makeup", "trending"];

export default function MyComponent() {
  const [content, setContent] = useState("");

  return (
    <TiptapEditor
      value={content}
      onChange={setContent}
      availableHashtags={HASHTAGS}
    />
  );
}
```

## Props

| Prop                | Type                              | Default                   | Description                                                                                                     |
| ------------------- | --------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `value`             | `string`                          | required                  | HTML content của editor                                                                                         |
| `onChange`          | `(value: string) => void`         | required                  | Callback khi content thay đổi                                                                                   |
| `placeholder`       | `string`                          | `'Nhập nội dung...'`      | Placeholder text                                                                                                |
| `className`         | `string`                          | `undefined`               | Custom CSS class                                                                                                |
| `onImageUpload`     | `(file: File) => Promise<string>` | `handleTiptapImageUpload` | Custom image upload handler. Nếu không cung cấp, sẽ dùng default handler upload lên `/api/upload/general-image` |
| `availableHashtags` | `string[]`                        | `[]`                      | Danh sách hashtags gợi ý                                                                                        |

## Image Upload Methods

### 1. File Picker

Click vào icon Image trong toolbar → Click "Tải ảnh lên" → Chọn file

### 2. Paste from Clipboard

1. Copy ảnh (từ screenshot, file explorer, web, etc.)
2. Click vào editor
3. Paste (Ctrl+V / Cmd+V)
4. Ảnh sẽ tự động upload và insert

### 3. Drag & Drop

1. Kéo file ảnh từ file explorer
2. Thả vào editor
3. Ảnh sẽ tự động upload và insert tại vị trí thả

## Default Image Upload

Nếu không cung cấp `onImageUpload` prop, editor sẽ tự động sử dụng default handler:

- Endpoint: `POST /api/upload/general-image`
- Authentication: Required (NextAuth session)
- Max size: 5MB
- Formats: JPEG, PNG, GIF, WebP
- Storage: S3-compatible (Storj)

## Keyboard Shortcuts

| Shortcut           | Action                   |
| ------------------ | ------------------------ |
| `Ctrl+B` / `Cmd+B` | Bold                     |
| `Ctrl+I` / `Cmd+I` | Italic                   |
| `Ctrl+U` / `Cmd+U` | Underline                |
| `Ctrl+Z` / `Cmd+Z` | Undo                     |
| `Ctrl+Y` / `Cmd+Y` | Redo                     |
| `Ctrl+V` / `Cmd+V` | Paste (including images) |

## Styling

Editor sử dụng Tailwind CSS và có thể customize qua `className` prop:

```tsx
<TiptapEditor value={content} onChange={setContent} className="min-h-[400px]" />
```

## Error Handling

Editor tự động handle errors khi upload:

- Show alert nếu upload thất bại
- Log error vào console
- Reset file input sau mỗi upload
- Không insert ảnh nếu upload fail

## Example: Product Description Editor

```tsx
"use client";

import { useCallback, useState } from "react";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Label } from "@/components/ui/label";

const PRODUCT_HASHTAGS = [
  "mỹphẩm",
  "skincare",
  "makeup",
  "beauty",
  "trending",
  "hot",
  "giảmgia",
];

export function ProductDescriptionEditor() {
  const [description, setDescription] = useState("");

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/general-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await response.json();
    return data.data.url;
  }, []);

  return (
    <div className="space-y-2">
      <Label>Mô tả sản phẩm</Label>
      <TiptapEditor
        value={description}
        onChange={setDescription}
        placeholder="Nhập mô tả chi tiết sản phẩm..."
        availableHashtags={PRODUCT_HASHTAGS}
        onImageUpload={handleImageUpload}
      />
      <p className="text-xs text-muted-foreground">
        Hỗ trợ định dạng văn bản, thêm hình ảnh (tải lên, dán hoặc kéo thả),
        hashtag và liên kết
      </p>
    </div>
  );
}
```

## Notes

- Images are automatically resized to fit editor width
- Images maintain aspect ratio
- Uploaded images are stored permanently in S3
- Images are associated with the uploading user
- All images are publicly accessible via CDN URL
- Editor content is saved as HTML
- Use `dangerouslySetInnerHTML` to render saved content (with proper sanitization)
