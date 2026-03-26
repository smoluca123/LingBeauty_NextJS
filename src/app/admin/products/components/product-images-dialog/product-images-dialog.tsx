'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Trash2,
  Loader2,
  UploadCloud,
  ImageIcon,
  Star,
  GripVertical,
} from 'lucide-react';
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
import { useProductImagesQuery } from '@/hooks/querys/admin-product.query';
import {
  useUploadProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
} from '@/hooks/mutations/admin-product.mutation';
import { toast } from 'sonner';
import type { IAdminProductImage } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Types ============

interface ProductImagesDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============ SortableImageCard Sub-component ============

interface SortableImageCardProps {
  image: IAdminProductImage;
  isDeletingThis: boolean;
  isSettingPrimaryThis: boolean;
  onDelete: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
}

function SortableImageCard({
  image,
  isDeletingThis,
  isSettingPrimaryThis,
  onDelete,
  onSetPrimary,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : ('auto' as const),
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={[
          'group relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm transition-shadow cursor-grab active:cursor-grabbing',
          isDragging
            ? 'shadow-xl ring-2 ring-primary-pink/50'
            : 'hover:shadow-md',
          image.isPrimary
            ? 'border-primary-pink ring-1 ring-primary-pink/30'
            : 'border-border',
        ].join(' ')}
      >
        <Image
          src={image.media.url}
          alt={image.alt ?? 'Product image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          draggable={false}
        />

        {/* ── Overlay khi hover ── */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ── Drag handle indicator (visual only) ── */}
        <div className="absolute top-2 right-2 z-10 p-1 rounded-md bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm pointer-events-none">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* ── Primary badge ── */}
        {image.isPrimary && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-primary-pink text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
            <Star className="h-3 w-3 fill-current" />
            Chính
          </div>
        )}

        {/* ── Sort order badge (khi không phải primary) ── */}
        {!image.isPrimary && (
          <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            #{image.sortOrder + 1}
          </div>
        )}

        {/* ── Hover actions ── */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Set primary */}
          {!image.isPrimary && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-lg shadow-lg bg-white/90 hover:bg-primary-pink hover:text-white text-foreground"
                  onClick={() => onSetPrimary(image.id)}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={isSettingPrimaryThis}
                >
                  {isSettingPrimaryThis ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Đặt làm ảnh chính</TooltipContent>
            </Tooltip>
          )}
          {image.isPrimary && <div />}

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-lg shadow-lg"
                onClick={() => onDelete(image.id)}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={isDeletingThis}
              >
                {isDeletingThis ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa ảnh</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============ Main Component ============

export function ProductImagesDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: ProductImagesDialogProps) {
  const { data: imagesData, isLoading: isLoadingImages } =
    useProductImagesQuery(open ? productId : null);

  const uploadMutation = useUploadProductImageMutation(productId);
  const updateImageMutation = useUpdateProductImageMutation(productId);
  const deleteMutation = useDeleteProductImageMutation(productId);

  const serverImages = useMemo(
    () => (imagesData?.data ?? []) as IAdminProductImage[],
    [imagesData?.data],
  );

  // ── Local state for optimistic reorder ──
  const [localImages, setLocalImages] = useState<IAdminProductImage[] | null>(
    null,
  );
  const [isReordering, setIsReordering] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  // Track previous localImages for rollback on error
  const prevLocalImagesRef = useRef<IAdminProductImage[] | null>(null);

  const images = localImages ?? serverImages;

  // Sync localImages from server when not in the middle of reordering
  useEffect(() => {
    if (
      !isReordering &&
      !uploadMutation.isPending &&
      !deleteMutation.isPending
    ) {
      setLocalImages(null);
    }
  }, [
    serverImages,
    isReordering,
    uploadMutation.isPending,
    deleteMutation.isPending,
  ]);

  // ── DnD sensors ──
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // ── react-dropzone ──
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    disabled: uploadMutation.isPending || uploadingCount > 0,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      setUploadingCount(acceptedFiles.length);

      // Upload all files in parallel using Promise.allSettled
      const uploadPromises = acceptedFiles.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return uploadMutation.mutateAsync(formData);
      });

      const results = await Promise.allSettled(uploadPromises);

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (succeeded > 0 && failed === 0) {
        toast.success(`Đã upload ${succeeded} ảnh thành công!`);
      } else if (succeeded > 0 && failed > 0) {
        toast.warning(
          `Upload ${succeeded}/${acceptedFiles.length} ảnh. ${failed} ảnh thất bại.`,
        );
      }
      // If all failed, the mutation's onError already shows toast

      setUploadingCount(0);
    },
  });

  // ── Handlers ──
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const currentImages = localImages ?? serverImages;
      const oldIndex = currentImages.findIndex((img) => img.id === active.id);
      const newIndex = currentImages.findIndex((img) => img.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // Save previous state for rollback
      prevLocalImagesRef.current = currentImages;

      // Optimistic: reorder locally and update sortOrder values
      const reordered = arrayMove(currentImages, oldIndex, newIndex).map(
        (img, index) => ({ ...img, sortOrder: index }),
      );
      setLocalImages(reordered);
      setIsReordering(true);

      // Find images whose sortOrder actually changed
      const changedImages = reordered.filter((newImg) => {
        const oldImg = currentImages.find((o) => o.id === newImg.id);
        return oldImg && oldImg.sortOrder !== newImg.sortOrder;
      });

      try {
        // Call PATCH /product/{id}/images/{imageId} for each changed image
        await Promise.all(
          changedImages.map((img) =>
            updateImageMutation.mutateAsync({
              imageId: img.id,
              data: { sortOrder: img.sortOrder },
            }),
          ),
        );
        toast.success('Đã lưu thứ tự ảnh!');
      } catch {
        // Rollback on error
        setLocalImages(prevLocalImagesRef.current);
        toast.error('Lưu thứ tự ảnh thất bại.');
      } finally {
        setIsReordering(false);
      }
    },
    [localImages, serverImages, updateImageMutation],
  );

  const handleSetPrimary = useCallback(
    (imageId: string) => {
      updateImageMutation.mutate(
        { imageId, data: { isPrimary: true } },
        {
          onSuccess: () => {
            toast.success('Đã đặt làm ảnh chính!');
          },
        },
      );
    },
    [updateImageMutation],
  );

  const handleDelete = useCallback(
    (imageId: string) => {
      deleteMutation.mutate(imageId);
    },
    [deleteMutation],
  );

  const anyPending =
    uploadMutation.isPending ||
    updateImageMutation.isPending ||
    deleteMutation.isPending ||
    isReordering ||
    uploadingCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-180 max-w-[90vw] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-primary-pink/20 to-primary-pink/5 text-primary-pink">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Quản lý hình ảnh</DialogTitle>
              <DialogDescription className="text-sm">
                {productName}
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
              uploadMutation.isPending || uploadingCount > 0
                ? 'opacity-60 pointer-events-none'
                : '',
            ].join(' ')}
          >
            <input {...getInputProps()} />
            {uploadMutation.isPending || uploadingCount > 0 ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
            ) : (
              <div
                className={`p-3 rounded-full ${isDragActive ? 'bg-primary-pink/20' : 'bg-muted'} transition-colors`}
              >
                <UploadCloud
                  className={`h-6 w-6 ${isDragActive ? 'text-primary-pink' : 'text-muted-foreground'}`}
                />
              </div>
            )}
            <p className="text-sm font-medium">
              {uploadingCount > 0
                ? `Đang upload ${uploadingCount} ảnh...`
                : uploadMutation.isPending
                  ? 'Đang upload...'
                  : isDragActive
                    ? 'Thả ảnh vào đây'
                    : 'Kéo & thả ảnh vào đây, hoặc click để chọn'}
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ PNG, JPG, WEBP • Chọn nhiều ảnh cùng lúc
            </p>
          </div>

          {/* ── Image count & hint ── */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {images.length} ảnh
              {images.length > 1 && ' • Kéo để sắp xếp thứ tự'}
            </p>
            {isReordering && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang lưu...
              </div>
            )}
          </div>

          {/* ── Image Grid with DnD ── */}
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
                Chưa có ảnh nào cho sản phẩm này.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Thêm ảnh bằng cách kéo thả hoặc click vào vùng trên.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((image) => (
                    <SortableImageCard
                      key={image.id}
                      image={image}
                      isDeletingThis={
                        deleteMutation.isPending &&
                        deleteMutation.variables === image.id
                      }
                      isSettingPrimaryThis={
                        updateImageMutation.isPending &&
                        updateImageMutation.variables?.imageId === image.id &&
                        updateImageMutation.variables?.data?.isPrimary === true
                      }
                      onDelete={handleDelete}
                      onSetPrimary={handleSetPrimary}
                    />
                  ))}
                  {/* Upload skeleton placeholders */}
                  {uploadingCount > 0 &&
                    [...Array(uploadingCount)].map((_, i) => (
                      <Skeleton
                        key={`upload-${i}`}
                        className="aspect-square rounded-xl"
                      />
                    ))}
                </div>
              </SortableContext>
            </DndContext>
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
