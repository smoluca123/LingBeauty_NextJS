import { uploadGeneralImage } from "@/lib/apis/client/upload.apis";

/**
 * Handle image upload for Tiptap editor
 * This function can be used with Tiptap's Image extension
 *
 * @example
 * ```tsx
 * import { useEditor } from '@tiptap/react';
 * import StarterKit from '@tiptap/starter-kit';
 * import Image from '@tiptap/extension-image';
 * import { handleTiptapImageUpload } from '@/lib/utils/tiptap-image-upload';
 *
 * const editor = useEditor({
 *   extensions: [
 *     StarterKit,
 *     Image.configure({
 *       inline: true,
 *       allowBase64: false,
 *     }),
 *   ],
 * });
 *
 * // In your component:
 * const handleImageUpload = async (file: File) => {
 *   try {
 *     const url = await handleTiptapImageUpload(file);
 *     editor?.chain().focus().setImage({ src: url }).run();
 *   } catch (error) {
 *     console.error('Upload failed:', error);
 *   }
 * };
 * ```
 */
export async function handleTiptapImageUpload(file: File): Promise<string> {
  try {
    const response = await uploadGeneralImage(file);

    // Backend returns: { type: 'response', message: '...', data: { url: '...' } }
    if (response.data?.url) {
      return response.data.url;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

/**
 * Create a file input handler for Tiptap editor
 * This returns a function that can be attached to a file input's onChange event
 *
 * @example
 * ```tsx
 * const handleFileChange = createTiptapImageUploadHandler(editor);
 *
 * return (
 *   <input
 *     type="file"
 *     accept="image/*"
 *     onChange={handleFileChange}
 *   />
 * );
 * ```
 */
export function createTiptapImageUploadHandler(editor: any) {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await handleTiptapImageUpload(file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error("Upload failed:", error);
      // You might want to show a toast notification here
    }
  };
}

/**
 * Handle paste event for Tiptap editor to upload images
 *
 * @example
 * ```tsx
 * const editor = useEditor({
 *   extensions: [
 *     StarterKit,
 *     Image,
 *   ],
 *   editorProps: {
 *     handlePaste: (view, event) => {
 *       return handleTiptapPasteImage(view, event, editor);
 *     },
 *   },
 * });
 * ```
 */
export async function handleTiptapPasteImage(
  view: any,
  event: ClipboardEvent,
  editor: any,
): Promise<boolean> {
  const items = event.clipboardData?.items;
  if (!items) return false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.type.indexOf("image") === 0) {
      event.preventDefault();

      const file = item.getAsFile();
      if (!file) continue;

      try {
        const url = await handleTiptapImageUpload(file);
        editor?.chain().focus().setImage({ src: url }).run();
        return true;
      } catch (error) {
        console.error("Paste upload failed:", error);
        return false;
      }
    }
  }

  return false;
}
