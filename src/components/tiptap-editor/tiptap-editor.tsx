'use client';
'use no memo'

import { useCallback, useState, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { handleTiptapImageUpload } from '@/lib/utils/tiptap-image-upload';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Highlighter,
  Undo,
  Redo,
  Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { HashtagExtension } from './extensions/hashtag';

// ============ Types ============
export interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onImageUpload?: (file: File) => Promise<string>;
  availableHashtags?: string[];
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}

// ============ Toolbar Button Component ============
function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-8 w-8 p-0 transition-all relative',
        isActive
          ? 'bg-primary-pink text-white hover:bg-primary-pink/90 shadow-sm ring-1 ring-primary-pink/20'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
      )}
    </Button>
  );
}

// ============ Toolbar Component ============
interface ToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<string>;
  availableHashtags?: string[];
}

function Toolbar({ editor, onImageUpload, availableHashtags }: ToolbarProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [isHashtagPopoverOpen, setIsHashtagPopoverOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImagePopoverOpen(false);
    }
  }, [editor, imageUrl]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onImageUpload && editor) {
        setIsUploadingImage(true);
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
          setIsImagePopoverOpen(false);
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert('Tải ảnh lên thất bại. Vui lòng thử lại.');
        } finally {
          setIsUploadingImage(false);
          // Reset file input
          if (e.target) {
            e.target.value = '';
          }
        }
      }
    },
    [editor, onImageUpload],
  );

  const addHashtag = useCallback(
    (tag: string) => {
      const cleanTag = tag.replace(/^#/, '');
      if (cleanTag && editor) {
        editor.chain().focus().setHashtag({ tag: cleanTag }).run();
        setHashtagInput('');
        setIsHashtagPopoverOpen(false);
      }
    },
    [editor],
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Nhập URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const filteredHashtags =
    availableHashtags?.filter((tag) =>
      tag.toLowerCase().includes(hashtagInput.toLowerCase().replace(/^#/, '')),
    ) || [];

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-muted/30">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Text Style */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="In đậm (Ctrl+B) - Click để bật/tắt"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="In nghiêng (Ctrl+I) - Click để bật/tắt"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Gạch chân (Ctrl+U) - Click để bật/tắt"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Gạch ngang - Click để bật/tắt"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Đánh dấu - Click để bật/tắt"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
          title="Tiêu đề 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
          title="Tiêu đề 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Danh sách dấu đầu dòng"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Danh sách đánh số"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Căn trái"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Căn giữa"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Căn phải"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Link */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border">
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Thêm liên kết"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Image */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border">
        <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0 transition-all',
                isImagePopoverOpen
                  ? 'bg-primary-pink text-white hover:bg-primary-pink/90'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground',
              )}
              title="Thêm hình ảnh"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL hình ảnh</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={addImage}>
                    Thêm
                  </Button>
                </div>
              </div>
              {onImageUpload && (
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-popover px-2 text-muted-foreground">
                        Hoặc
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? 'Đang tải lên...' : 'Tải ảnh lên'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploadingImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Hoặc dán/kéo thả ảnh vào editor
                  </p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Hashtag */}
      <div className="flex items-center gap-0.5 px-2">
        <Popover
          open={isHashtagPopoverOpen}
          onOpenChange={setIsHashtagPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0 transition-all',
                isHashtagPopoverOpen
                  ? 'bg-primary-pink text-white hover:bg-primary-pink/90'
                  : 'text-primary-pink hover:bg-primary-pink/10',
              )}
              title="Thêm hashtag"
            >
              <Hash className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-2">
              <Label>Thêm hashtag</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập hashtag..."
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHashtag(hashtagInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addHashtag(hashtagInput)}
                >
                  Thêm
                </Button>
              </div>
              {filteredHashtags.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Hashtag gợi ý:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {filteredHashtags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addHashtag(tag)}
                        className="inline-flex items-center rounded-full bg-primary-pink/10 px-2 py-1 text-xs text-primary-pink hover:bg-primary-pink/20 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// ============ Main Editor Component ============
export function TiptapEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className,
  onImageUpload,
  availableHashtags = [],
}: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Use provided onImageUpload or default to handleTiptapImageUpload
  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      if (onImageUpload) {
        return onImageUpload(file);
      }
      return handleTiptapImageUpload(file);
    },
    [onImageUpload],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-pink underline',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight,
      HashtagExtension,
    ],
    content: value,
    onUpdate: ({ editor: editorInstance }) => {
      onChange(editorInstance.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 [&_.hashtag]:text-primary-pink [&_.hashtag]:font-medium [&_.hashtag]:bg-primary-pink/10 [&_.hashtag]:px-1.5 [&_.hashtag]:py-0.5 [&_.hashtag]:rounded',
      },
      // Handle paste events for images
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          if (item.type.indexOf('image') === 0) {
            event.preventDefault();

            const file = item.getAsFile();
            if (!file) continue;

            setIsUploading(true);
            uploadImage(file)
              .then((url) => {
                editor?.chain().focus().setImage({ src: url }).run();
              })
              .catch((error) => {
                console.error('Paste upload failed:', error);
              })
              .finally(() => {
                setIsUploading(false);
              });

            return true;
          }
        }

        return false;
      },
      // Handle drop events for images
      handleDrop: (view, event, slice, moved) => {
        if (moved || !event.dataTransfer?.files?.length) {
          return false;
        }

        const files = Array.from(event.dataTransfer.files);
        const imageFiles = files.filter((file) =>
          file.type.startsWith('image/'),
        );

        if (imageFiles.length === 0) {
          return false;
        }

        event.preventDefault();

        const { schema } = view.state;
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        imageFiles.forEach((file) => {
          setIsUploading(true);
          uploadImage(file)
            .then((url) => {
              const node = schema.nodes.image.create({ src: url });
              const transaction = view.state.tr.insert(
                coordinates?.pos ?? 0,
                node,
              );
              view.dispatch(transaction);
            })
            .catch((error) => {
              console.error('Drop upload failed:', error);
            })
            .finally(() => {
              setIsUploading(false);
            });
        });

        return true;
      },
    },
  });

  return (
    <div
      className={cn(
        'rounded-md border border-input bg-background overflow-hidden',
        className,
      )}
    >
      <Toolbar
        editor={editor}
        onImageUpload={uploadImage}
        availableHashtags={availableHashtags}
      />
      {isUploading && (
        <div className="px-4 py-2 text-sm text-muted-foreground bg-muted/50 border-b">
          Đang tải ảnh lên...
        </div>
      )}
      <EditorContent editor={editor} />
      <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/30 border-t">
        💡 Tip: Nút toolbar sáng = có định dạng trong vùng chọn. Click để bật/tắt.
      </div>
    </div>
  );
}

export default TiptapEditor;
