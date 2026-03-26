'use client';

import { useState } from 'react';
import { uploadGeneralImage } from '@/lib/apis/client/upload.apis';
import Image from 'next/image';

interface GeneralImageUploadProps {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSizeMB?: number;
}

/**
 * General purpose image upload component
 * Can be used for tiptap editor, rich text editor, or any general image upload needs
 * 
 * @example
 * ```tsx
 * <GeneralImageUpload
 *   onUploadSuccess={(url) => console.log('Uploaded:', url)}
 *   onUploadError={(error) => console.error('Error:', error)}
 * />
 * ```
 */
export function GeneralImageUpload({
  onUploadSuccess,
  onUploadError,
  accept = 'image/*',
  maxSizeMB = 5,
}: GeneralImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const error = new Error(`File size exceeds ${maxSizeMB}MB`);
      onUploadError?.(error);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const response = await uploadGeneralImage(file);
      const url = response.data.url;
      
      if (url) {
        onUploadSuccess?.(url);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      onUploadError?.(error as Error);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {uploading && (
        <div className="text-sm text-muted-foreground">
          Uploading...
        </div>
      )}

      {preview && !uploading && (
        <div className="relative w-full max-w-xs">
          <Image
            src={preview}
            alt="Preview"
            className="rounded-lg border"
            fill
          />
        </div>
      )}
    </div>
  );
}
