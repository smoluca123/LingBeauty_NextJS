'use client'

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/loading-button'
import { Upload, ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'
import { getCroppedImageFile } from '@/hooks/use-image-crop'
import { useUploadAvatarMutation } from '@/hooks/mutations/user.mutation'
import { toast } from 'sonner'

// ============ Constants ============
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const CROP_ASPECT_RATIO = 1 // Square crop for avatar

// ============ Helpers ============
function createInitialCrop(width: number, height: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, CROP_ASPECT_RATIO, width, height),
    width,
    height,
  )
}

// ============ Props ============
interface IAvatarUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ============ Component ============
export function AvatarUploadDialog({
  open,
  onOpenChange,
}: IAvatarUploadDialogProps) {
  const [imgSrc, setImgSrc] = useState<string>('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: uploadAvatar, isPending: isUploading } =
    useUploadAvatarMutation()

  // ============ Cleanup state on close ============
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setImgSrc('')
        setCrop(undefined)
        setCompletedCrop(undefined)
        setIsDraggingOver(false)
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange],
  )

  // ============ File validation & loading ============
  const loadImageFile = useCallback((file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Chỉ hỗ trợ định dạng JPG, PNG, WebP')
      return
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`Kích thước ảnh tối đa ${MAX_FILE_SIZE_MB}MB`)
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() ?? '')
      setCrop(undefined)
      setCompletedCrop(undefined)
    })
    reader.readAsDataURL(file)
  }, [])

  // ============ File input change ============
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) loadImageFile(file)
      // Reset input so same file can be re-selected
      e.target.value = ''
    },
    [loadImageFile],
  )

  // ============ Drag & Drop handlers ============
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDraggingOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) loadImageFile(file)
    },
    [loadImageFile],
  )

  // ============ Image load callback: set initial crop ============
  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      setCrop(createInitialCrop(width, height))
    },
    [],
  )

  // ============ Submit: crop + upload ============
  const handleConfirm = useCallback(async () => {
    if (!imgRef.current || !completedCrop) {
      toast.error('Vui lòng chọn vùng ảnh để cắt')
      return
    }

    try {
      const croppedFile = await getCroppedImageFile(
        imgRef.current,
        completedCrop,
        'avatar.jpg',
      )
      uploadAvatar(croppedFile, {
        onSuccess: () => handleOpenChange(false),
      })
    } catch {
      toast.error('Có lỗi xảy ra khi xử lý ảnh')
    }
  }, [completedCrop, uploadAvatar, handleOpenChange])

  // ============ Reset to pick another image ============
  const handleReset = useCallback(() => {
    setImgSrc('')
    setCrop(undefined)
    setCompletedCrop(undefined)
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
        </DialogHeader>

        {/* ---- Drop Zone (no image selected) ---- */}
        {!imgSrc && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Khu vực tải ảnh lên, nhấp hoặc kéo thả ảnh vào đây"
            className={cn(
              'flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer select-none',
              isDraggingOver
                ? 'border-primary-pink bg-primary-pink/5'
                : 'border-border hover:border-primary-pink/60 hover:bg-muted/50',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === 'Enter' && fileInputRef.current?.click()
            }
          >
            <div
              className={cn(
                'flex size-16 items-center justify-center rounded-full transition-colors',
                isDraggingOver ? 'bg-primary-pink/20' : 'bg-muted',
              )}
            >
              <Upload
                className={cn(
                  'size-7 transition-colors',
                  isDraggingOver
                    ? 'text-primary-pink'
                    : 'text-muted-foreground',
                )}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Kéo thả ảnh vào đây hoặc{' '}
                <span className="text-primary-pink underline underline-offset-2">
                  chọn ảnh
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG, WebP – Tối đa {MAX_FILE_SIZE_MB}MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={handleFileInputChange}
              aria-label="Chọn file ảnh đại diện"
            />
          </div>
        )}

        {/* ---- Crop Area (image selected) ---- */}
        {imgSrc && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="size-4" />
                <span>Kéo để điều chỉnh vùng cắt</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={handleReset}
                aria-label="Chọn ảnh khác"
              >
                <X className="size-3" />
                Chọn ảnh khác
              </Button>
            </div>

            {/* Crop container */}
            <div className="flex justify-center bg-muted/50 overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={CROP_ASPECT_RATIO}
                circularCrop
                keepSelection
                className="my-auto" // center vertically if image is shorter
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Ảnh cần cắt"
                  className="max-h-80 w-auto object-contain"
                  onLoad={handleImageLoad}
                />
              </ReactCrop>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Ảnh đại diện sẽ được hiển thị dạng hình tròn
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <LoadingButton
            type="button"
            variant="primary-pink"
            className="min-w-28 rounded-full"
            loading={isUploading}
            disabled={!imgSrc || !completedCrop}
            onClick={handleConfirm}
          >
            Lưu ảnh
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
