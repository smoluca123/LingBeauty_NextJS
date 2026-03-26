'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface ImageUploadDropzoneProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  onRemove?: () => void
  label?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
}

export function ImageUploadDropzone({
  value,
  onChange,
  onRemove,
  label = 'Hình ảnh',
  accept = 'image/*',
  maxSize = 5,
  className,
  disabled = false,
}: ImageUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get preview URL
  const previewUrl =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === 'string'
        ? value
        : null

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh')
        return
      }
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Kích thước file không được vượt quá ${maxSize}MB`)
        return
      }
      setError(null)
      onChange(file)
    },
    [onChange, maxSize],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = useCallback(() => {
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }, [onChange, onRemove])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      {label && <Label>{label}</Label>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <div className="rounded-full bg-muted p-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              Kéo thả ảnh vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ: JPG, PNG, GIF (tối đa {maxSize}MB)
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative w-full rounded-lg border bg-muted/30 p-4 transition-colors',
            isDragging && 'border-primary bg-primary/5 border-2',
          )}
        >
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 rounded-lg border object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {value instanceof File ? value.name : 'Ảnh hiện tại'}
              </p>
              {value instanceof File && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(value.size / 1024).toFixed(2)} KB
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="mt-3"
              >
                <Upload className="h-3 w-3 mr-2" />
                Thay đổi
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Hoặc kéo thả ảnh mới vào đây
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
