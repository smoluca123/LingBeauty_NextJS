'use client';

import { useCallback } from 'react';
import { EditorWithPreview } from '@/components/tiptap-editor';
import { Label } from '@/components/ui/label';

// ============ Types ============
interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// ============ Hashtag suggestions ============
const SUGGESTED_HASHTAGS = [
  'mỹphẩm',
  'skincare',
  'makeup',
  'beauty',
  'chămsócda',
  'làmđẹp',
  'trangđiểm',
  'sảnphẩmmới',
  'bánchạy',
  'khuyếnmãi',
  'freeship',
  'hot',
  'trending',
  'giảmgia',
  'combo',
  'quàtặng',
  'organic',
  'natural',
  'hàngnộiđịa',
  'hànquốc',
  'nhậtbản',
];

// ============ Component ============
export function DescriptionEditor({ value, onChange }: DescriptionEditorProps) {
  // Image upload handler - upload to general image endpoint
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload to general image API endpoint
    const response = await fetch('/api/upload/general-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    // Backend returns: { type: 'response', message: '...', data: { url: '...' } }
    return data.data.url;
  }, []);

  return (
    <div className='space-y-2'>
      <Label>Mô tả chi tiết</Label>
      <EditorWithPreview
        value={value}
        onChange={onChange}
        placeholder='Nhập mô tả chi tiết sản phẩm với định dạng đẹp, hình ảnh và hashtag...'
        availableHashtags={SUGGESTED_HASHTAGS}
        onImageUpload={handleImageUpload}
      />
      <p className='text-xs text-muted-foreground'>
        Hỗ trợ định dạng văn bản, thêm hình ảnh (tải lên, dán hoặc kéo thả), hashtag và liên kết
      </p>
    </div>
  );
}

export default DescriptionEditor;
