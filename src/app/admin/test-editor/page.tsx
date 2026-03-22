'use client';

import { useState } from 'react';
import { EditorWithPreview } from '@/components/tiptap-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DEMO_HASHTAGS = [
  'mỹphẩm',
  'skincare',
  'makeup',
  'beauty',
  'chămsócda',
  'làmđẹp',
  'trangđiểm',
  'trending',
  'hot',
  'giảmgia',
];

export default function TestEditorPage() {
  const [content, setContent] = useState('<p>Thử nhập nội dung, paste ảnh (Ctrl+V), hoặc kéo thả ảnh vào đây...</p>');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tiptap Editor Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test tất cả tính năng của editor với image upload
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditorWithPreview
            value={content}
            onChange={setContent}
            placeholder="Nhập nội dung..."
            availableHashtags={DEMO_HASHTAGS}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Ẩn HTML Output' : 'Xem HTML Output'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                console.log('Content:', content);
                alert('Content đã được log vào console');
              }}
            >
              Log Content
            </Button>
            <Button
              variant="outline"
              onClick={() => setContent('')}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview (HTML Output)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Rendered HTML:</h3>
                <div
                  className="prose prose-sm max-w-none [&_.hashtag]:text-primary-pink [&_.hashtag]:font-medium [&_.hashtag]:bg-primary-pink/10 [&_.hashtag]:px-1.5 [&_.hashtag]:py-0.5 [&_.hashtag]:rounded"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Raw HTML:</h3>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap wrap-break-word">
                  {content}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">📝 Định dạng văn bản:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Sử dụng toolbar để định dạng (bold, italic, underline, etc.)</li>
                <li>Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline)</li>
                <li>Hỗ trợ headings, lists, text alignment</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🖼️ Upload ảnh (3 cách):</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Cách 1:</strong> Click icon Image → Click &quot;Tải ảnh lên&quot; → Chọn file</li>
                <li><strong>Cách 2:</strong> Copy ảnh (screenshot/file) → Paste vào editor (Ctrl+V)</li>
                <li><strong>Cách 3:</strong> Kéo file ảnh từ file explorer → Thả vào editor</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">#️⃣ Hashtags:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Click icon # trong toolbar</li>
                <li>Nhập hashtag hoặc chọn từ gợi ý</li>
                <li>Hashtag sẽ được highlight với màu pink</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🔗 Links:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Select text → Click icon Link → Nhập URL</li>
                <li>Links sẽ mở trong tab mới</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">⚙️ Technical Details:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Images upload to: <code>/api/upload/general-image</code></li>
                <li>Max file size: 5MB</li>
                <li>Supported formats: JPEG, PNG, GIF, WebP</li>
                <li>Storage: S3-compatible (Storj)</li>
                <li>Authentication: Required (NextAuth session)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
