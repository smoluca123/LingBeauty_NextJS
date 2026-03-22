'use client';

import { TiptapEditor, type TiptapEditorProps } from './tiptap-editor';
import { EditorPreview } from './editor-preview';

interface EditorWithPreviewProps extends TiptapEditorProps {
  showPreview?: boolean;
  previewButtonClassName?: string;
}

/**
 * Tiptap Editor với nút preview tích hợp
 * Wrapper component để dễ dàng sử dụng editor + preview
 */
export function EditorWithPreview({
  value,
  onChange,
  placeholder,
  className,
  onImageUpload,
  availableHashtags,
  showPreview = true,
  previewButtonClassName,
}: EditorWithPreviewProps) {
  return (
    <div className="space-y-2">
      <TiptapEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        onImageUpload={onImageUpload}
        availableHashtags={availableHashtags}
      />
      {showPreview && value && (
        <div className="flex justify-end">
          <EditorPreview
            content={value}
            triggerClassName={previewButtonClassName}
          />
        </div>
      )}
    </div>
  );
}
