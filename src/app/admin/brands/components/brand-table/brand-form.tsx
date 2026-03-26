'use client'

import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { RichTextField } from '@/components/form/rich-text-field'
import { ImageUploadDropzone } from '@/app/admin/components'
import type { IBrandFormData } from '@/lib/types/interfaces/apis/admin-brand.interfaces'

interface BrandFormProps {
  form: UseFormReturn<IBrandFormData>
  logoPreview: string | null
  onLogoChange: (file: File, previewUrl: string) => void
  onLogoRemove: () => void
}

export function BrandForm({
  form,
  logoPreview,
  onLogoChange,
  onLogoRemove,
}: BrandFormProps) {
  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onLogoChange(file, reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      onLogoRemove()
    }
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên thương hiệu *</FormLabel>
            <FormControl>
              <Input placeholder="Nhập tên thương hiệu" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <RichTextField
        control={form.control}
        name="description"
        label="Mô tả"
        placeholder="Mô tả thương hiệu (tuỳ chọn)"
        availableHashtags={['thương hiệu', 'brand', 'chính hãng', 'uy tín']}
      />

      {/* Website */}
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Logo upload */}
      <ImageUploadDropzone
        value={logoPreview}
        onChange={handleFileChange}
        onRemove={onLogoRemove}
        label="Logo thương hiệu"
        maxSize={5}
      />

      {/* isActive */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <FormLabel className="text-sm font-medium">Kích hoạt</FormLabel>
              <p className="text-xs text-muted-foreground">
                Bật để hiển thị thương hiệu trên website
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
