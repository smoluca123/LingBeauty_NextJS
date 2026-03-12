'use client';

import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Trash2, Loader2, UploadCloud, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useVariantImagesQuery,
  useUploadVariantImageMutation,
  useDeleteVariantImageMutation,
} from '@/hooks/querys/admin-product.query';
import type { IAdminProductImage } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Types ============

interface VariantImagesDialogProps {
  productId: string;
  variantId: string;
  variantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============ VariantImageCard Sub-component ============

interface VariantImageCardProps {
  image: IAdminProductImage;
  isDeleting: boolean;
  onDelete: (imageId: string) => void;
}

function VariantImageCard({ image, isDeleting, onDelete }: VariantImageCardProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted shadow-sm transition-shadow hover:shadow-md">
        <Image
          src={image.media.url}
          alt={image.alt ?? 'Variant image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* ── Overlay khi hover ── */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ── Nút xóa: hiện khi hover ── */}
        <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-lg shadow-lg"
                onClick={() => onDelete(image.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa ảnh</TooltipContent>
          </Tooltip>
        </div>

        {/* ── Badge thứ tự ── */}
        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
          #{image.sortOrder + 1}
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============ Component ============

export function VariantImagesDialog({
  productId,
  variantId,
  variantName,
  open,
  onOpenChange,
}: VariantImagesDialogProps) {
  const { data: imagesData, isLoading: isLoadingImages } =
    useVariantImagesQuery(open ? productId : null, open ? variantId : null);

  const uploadMutation = useUploadVariantImageMutation(productId, variantId);
  const deleteMutation = useDeleteVariantImageMutation(productId, variantId);

  const images = (imagesData?.data ?? []) as IAdminProductImage[];

  // ── react-dropzone ──────────────────────────────────────────────────────────
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    disabled: uploadMutation.isPending,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        await uploadMutation.mutateAsync(formData);
      }
    },
  });

  const handleDelete = (imageId: string) => deleteMutation.mutate(imageId);

  const anyPending = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[680px] max-w-[90vw] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-primary-pink/20 to-primary-pink/5 text-primary-pink">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Ảnh biến thể</DialogTitle>
              <DialogDescription className="text-sm">
                {variantName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* ── Dropzone ── */}
          <div
            {...getRootProps()}
            className={[
              'flex flex-col items-center justify-center gap-2 px-6 py-8',
              'rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer',
              isDragActive
                ? 'border-primary-pink bg-primary-pink/10 text-primary-pink scale-[1.02]'
                : 'border-border hover:border-primary-pink/60 hover:bg-muted/60',
              uploadMutation.isPending ? 'opacity-60 pointer-events-none' : '',
            ].join(' ')}
          >
            <input {...getInputProps()} />
            {uploadMutation.isPending ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
            ) : (
              <div className={`p-3 rounded-full ${isDragActive ? 'bg-primary-pink/20' : 'bg-muted'} transition-colors`}>
                <UploadCloud
                  className={`h-6 w-6 ${isDragActive ? 'text-primary-pink' : 'text-muted-foreground'}`}
                />
              </div>
            )}
            <p className="text-sm font-medium">
              {uploadMutation.isPending
                ? 'Đang upload...'
                : isDragActive
                  ? 'Thả ảnh vào đây'
                  : 'Kéo & thả ảnh vào đây, hoặc click để chọn'}
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ PNG, JPG, WEBP • Chọn nhiều ảnh cùng lúc
            </p>
          </div>

          {/* ── Image count ── */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {images.length} ảnh {images.length > 0 && '• Hover để xóa'}
            </p>
          </div>

          {/* ── Image Grid ── */}
          {isLoadingImages ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="p-4 rounded-full bg-muted mb-3">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Chưa có ảnh nào cho biến thể này.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Thêm ảnh bằng cách kéo thả hoặc click vào vùng trên.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((image) => (
                <VariantImageCard
                  key={image.id}
                  image={image}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === image.id
                  }
                  onDelete={handleDelete}
                />
              ))}
              {/* Upload skeleton placeholder */}
              {uploadMutation.isPending && (
                <Skeleton className="aspect-square rounded-xl" />
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button
            variant="primary-pink"
            onClick={() => onOpenChange(false)}
            disabled={anyPending}
          >
            Hoàn thành
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
