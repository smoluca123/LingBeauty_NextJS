import { uploadGeneralImage } from '@/lib/apis/client/upload.apis'
import type { Editor } from '@tiptap/react'
import type { EditorView } from '@tiptap/pm/view'

/**
 * Tiptap editor utilities for image upload and paste handling
 */

/**
 * Handle image upload for Tiptap editor
 * This function can be used with Tiptap's Image extension
 * @param file - The image file to upload
 * @returns The uploaded image URL
 * @example
 * ```tsx
 * import { useEditor } from '@tiptap/react';
 * import StarterKit from '@tiptap/starter-kit';
 * import Image from '@tiptap/extension-image';
 * import { handleTiptapImageUpload } from '@/lib/utils/tiptap-utils';
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
    const response = await uploadGeneralImage(file)

    // Backend returns: { type: 'response', message: '...', data: { url: '...' } }
    if (response.data.url) {
      return response.data.url
    }

    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
}

/**
 * Create a file input handler for Tiptap editor
 * This returns a function that can be attached to a file input's onChange event
 * @param editor - The Tiptap editor instance
 * @returns File input change handler function
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
export function createTiptapImageUploadHandler(editor: Editor | null) {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const url = await handleTiptapImageUpload(file)
      editor?.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Upload failed:', error)
      // You might want to show a toast notification here
    }
  }
}

/**
 * Handle paste event for Tiptap editor to upload images
 * Intercepts clipboard paste events and uploads image files
 * @param view - The Tiptap editor view
 * @param event - The clipboard paste event
 * @param editor - The Tiptap editor instance
 * @returns True if image was handled, false otherwise
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
  view: EditorView,
  event: ClipboardEvent,
  editor: Editor | null,
): Promise<boolean> {
  const items = event.clipboardData?.items
  if (!items) return false

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item.type.indexOf('image') === 0) {
      event.preventDefault()

      const file = item.getAsFile()
      if (!file) continue

      try {
        const url = await handleTiptapImageUpload(file)
        editor?.chain().focus().setImage({ src: url }).run()
        return true
      } catch (error) {
        console.error('Paste upload failed:', error)
        return false
      }
    }
  }

  return false
}
