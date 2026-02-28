'use client';
'use no memo';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImagePlus, Star, StarOff, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import {
  useProductImages,
  useUploadProductImage,
  useUpdateProductImage,
  useDeleteProductImage,
} from '../../hooks';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A file staged locally, waiting to be uploaded on Save */
interface StagedImage {
  id: string;
  url: string;
  file: File;
  isPrimary: boolean;
  isUploading: boolean;
}

interface UploadImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IAdminProductDataType | null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function UploadImageDialog({ open, onOpenChange, product }: UploadImageDialogProps) {
  const productId = product?.id ?? null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Staged files (not yet uploaded to server).
   * Stored separately from server images to avoid setState-in-effect anti-pattern.
   */
  const [staged, setStaged] = useState<StagedImage[]>([]);

  /**
   * Override map for server images: imageId → isPrimary override.
   * Only populated when user explicitly changes primary on an existing image.
   */
  const [primaryOverride, setPrimaryOverride] = useState<string | null>(null);

  // ── Server data ──────────────────────────────────────────────────────────
  const { data: serverImages, isLoading: isLoadingImages } = useProductImages(
    open ? productId : null,
  );

  const uploadMutation = useUploadProductImage(productId ?? '');
  const updateMutation = useUpdateProductImage(productId ?? '');
  const deleteMutation = useDeleteProductImage(productId ?? '');

  const isSaving = uploadMutation.isPending || updateMutation.isPending;

  // ── Derived view ─────────────────────────────────────────────────────────

  /** Compute effective isPrimary + sort: primary first, then by sortOrder */
  const serverImagesView = (serverImages ?? [])
    .map((img) => ({
      ...img,
      effectivePrimary: primaryOverride ? primaryOverride === img.id : img.isPrimary,
    }))
    .sort((a, b) => {
      if (a.effectivePrimary && !b.effectivePrimary) return -1;
      if (!a.effectivePrimary && b.effectivePrimary) return 1;
      return a.sortOrder - b.sortOrder;
    });

  /** Total image count */
  const totalCount = serverImagesView.length + staged.length;

  /** Whether user has unsaved changes */
  const hasChanges =
    staged.length > 0 ||
    (primaryOverride !== null &&
      primaryOverride !== serverImages?.find((img) => img.isPrimary)?.id);

  // ── File staging ─────────────────────────────────────────────────────────
  const stageFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const next: StagedImage[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        id: `staged-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        isPrimary: false,
        isUploading: false,
      }));
    setStaged((prev) => [...prev, ...next]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stageFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    stageFiles(e.dataTransfer.files);
  };

  // ── Primary management ───────────────────────────────────────────────────

  const handleSetPrimary = (id: string, isExisting: boolean) => {
    if (isExisting) {
      // Override primary for server images
      setPrimaryOverride(id);
      // Clear primary flag on all staged images
      setStaged((prev) => prev.map((s) => ({ ...s, isPrimary: false })));
    } else {
      // Set primary on a staged image
      setPrimaryOverride(null); // clear server override
      setStaged((prev) => prev.map((s) => ({ ...s, isPrimary: s.id === id })));
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────

  const handleDeleteExisting = async (imageId: string) => {
    if (!productId) return;
    try {
      await deleteMutation.mutateAsync(imageId);
      // If deleted image was the primary override, clear it
      if (primaryOverride === imageId) setPrimaryOverride(null);
      toast.success('Đã xoá ảnh');
    } catch {
      toast.error('Không thể xoá ảnh');
    }
  };

  const handleDeleteStaged = (stagedId: string) => {
    setStaged((prev) => prev.filter((s) => s.id !== stagedId));
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!productId) return;

    try {
      // 1. Upload all staged files
      for (const img of staged) {
        const isPrimary =
          img.isPrimary ||
          // If no primary override anywhere, mark first upload as primary if server has no images
          (serverImages?.length === 0 && staged.indexOf(img) === 0);

        setStaged((prev) =>
          prev.map((s) => (s.id === img.id ? { ...s, isUploading: true } : s)),
        );
        await uploadMutation.mutateAsync({ file: img.file, isPrimary });
        setStaged((prev) => prev.filter((s) => s.id !== img.id));
      }

      // 2. Apply primary override on existing images
      if (primaryOverride) {
        const currentPrimary = serverImages?.find((img) => img.isPrimary);
        if (currentPrimary?.id !== primaryOverride) {
          await updateMutation.mutateAsync({
            imageId: primaryOverride,
            payload: { isPrimary: true },
          });
        }
      }

      setPrimaryOverride(null);
      toast.success('Cập nhật hình ảnh thành công!');
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh');
    }
  };

  // ── Close ────────────────────────────────────────────────────────────────

  const handleClose = () => {
    setStaged([]);
    setPrimaryOverride(null);
    onOpenChange(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý hình ảnh sản phẩm</DialogTitle>
          <DialogDescription>
            Tải lên hoặc xoá hình ảnh cho sản phẩm&nbsp;
            <span className="font-medium text-foreground">{product?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 
            rounded-xl border-2 border-dashed p-10 cursor-pointer
            transition-colors duration-200
            ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40'}
          `}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              Kéo &amp; thả ảnh vào đây, hoặc{' '}
              <span className="text-primary underline underline-offset-2">chọn file</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG, WEBP · Tối đa 5 MB mỗi ảnh
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>

        {/* Image grid */}
        {isLoadingImages ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : totalCount > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {totalCount} ảnh · nhấp <Star className="inline h-3.5 w-3.5" /> để đặt làm ảnh chính
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {/* ── Existing server images ── */}
              {serverImagesView.map((img) => (
                <div
                  key={img.id}
                  className={`
                    group relative aspect-square rounded-lg overflow-hidden border-2 transition-colors
                    ${img.effectivePrimary ? 'border-primary' : 'border-transparent'}
                  `}
                >
                  <Image
                    src={img.media.url}
                    alt={img.alt ?? 'product image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 25vw"
                  />

                  {/* Overlay: hover actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id, true)}
                      title="Đặt làm ảnh chính"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-yellow-500 hover:bg-white transition-colors"
                    >
                      {img.effectivePrimary ? (
                        <Star className="h-3.5 w-3.5 fill-yellow-400" />
                      ) : (
                        <StarOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(img.id)}
                      title="Xoá ảnh"
                      disabled={deleteMutation.isPending}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-destructive hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Primary badge */}
                  {img.effectivePrimary && (
                    <Badge className="absolute bottom-1 left-1 text-[10px] px-1 py-0 h-4 pointer-events-none">
                      Chính
                    </Badge>
                  )}

                  {/* Primary star (visible when not hovering) */}
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id, true)}
                    className="absolute top-1 right-1 group-hover:hidden"
                  >
                    {img.effectivePrimary && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow" />
                    )}
                  </button>
                </div>
              ))}

              {/* ── Staged (new) images ── */}
              {staged.map((img) => (
                <div
                  key={img.id}
                  className={`
                    group relative aspect-square rounded-lg overflow-hidden border-2 transition-colors
                    ${img.isPrimary ? 'border-primary' : 'border-transparent'}
                  `}
                >
                  <Image
                    src={img.url}
                    alt="new image"
                    fill
                    className={`object-cover transition-opacity ${img.isUploading ? 'opacity-50' : ''}`}
                    sizes="(max-width: 768px) 33vw, 25vw"
                  />

                  {/* Uploading spinner */}
                  {img.isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}

                  {/* Overlay: hover actions */}
                  {!img.isUploading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id, false)}
                        title="Đặt làm ảnh chính"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-yellow-500 hover:bg-white transition-colors"
                      >
                        {img.isPrimary ? (
                          <Star className="h-3.5 w-3.5 fill-yellow-400" />
                        ) : (
                          <StarOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaged(img.id)}
                        title="Xoá ảnh"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-destructive hover:bg-white transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Badges */}
                  {img.isPrimary && (
                    <Badge className="absolute bottom-1 left-1 text-[10px] px-1 py-0 h-4 pointer-events-none">
                      Chính
                    </Badge>
                  )}
                  {!img.isUploading && (
                    <Badge
                      variant="secondary"
                      className="absolute top-1 left-1 text-[10px] px-1 py-0 h-4 pointer-events-none"
                    >
                      Mới
                    </Badge>
                  )}

                  {/* Primary star shortcut */}
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id, false)}
                    className="absolute top-1 right-1 group-hover:hidden"
                  >
                    {img.isPrimary && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow" />
                    )}
                  </button>
                </div>
              ))}

              {/* Add more tile */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-muted/40 transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Thêm</span>
              </button>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
            Huỷ
          </Button>
          <Button
            type="button"
            variant="primary-pink"
            onClick={handleSave}
            disabled={!hasChanges || isSaving || !productId}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
