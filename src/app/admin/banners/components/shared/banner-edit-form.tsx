'use client'

import { useCallback, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useUpdateBannerMutation,
  useUpdateBannerWithUploadMutation,
} from '@/hooks/mutations/admin-banner.mutation'
import type { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import {
  BANNER_TYPES,
  BANNER_POSITIONS,
  DEFAULT_GRADIENT,
} from '@/app/admin/banners/constants'
import { ImageUploadDropzone } from '@/app/admin/components'
import { bannerEditSchema, type BannerEditFormValues } from '@/lib/schemas'

interface BannerEditFormProps {
  banner: IBannerDataType
  onSuccess: () => void
  onCancel: () => void
}

export function BannerEditForm({
  banner,
  onSuccess,
  onCancel,
}: BannerEditFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const updateMutation = useUpdateBannerMutation()
  const updateWithUploadMutation = useUpdateBannerWithUploadMutation()
  const isPending =
    updateMutation.isPending || updateWithUploadMutation.isPending

  const form = useForm<BannerEditFormValues>({
    resolver: zodResolver(bannerEditSchema),
    defaultValues: {
      type: (banner.type as 'TEXT' | 'IMAGE') ?? 'TEXT',
      position:
        (banner.position as 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM') ??
        'MAIN_CAROUSEL',
      badge: banner.badge ?? '',
      title: banner.title ?? '',
      description: banner.description ?? '',
      highlight: banner.highlight ?? '',
      ctaText: banner.ctaText ?? '',
      ctaLink: banner.ctaLink ?? '',
      subLabel: banner.subLabel ?? '',
      gradientFrom: banner.gradientFrom ?? DEFAULT_GRADIENT.from,
      gradientTo: banner.gradientTo ?? DEFAULT_GRADIENT.to,
      isActive: banner.isActive ?? true,
    },
  })

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const onSubmit = async (data: BannerEditFormValues) => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('type', data.type)
      formData.append('position', data.position)
      formData.append('badge', data.badge || '')
      formData.append('title', data.title)
      formData.append('description', data.description || '')
      formData.append('highlight', data.highlight || '')
      formData.append('ctaText', data.ctaText || '')
      formData.append('ctaLink', data.ctaLink || '')
      formData.append('subLabel', data.subLabel || '')
      formData.append('gradientFrom', data.gradientFrom || '')
      formData.append('gradientTo', data.gradientTo || '')
      formData.append('isActive', String(data.isActive))
      formData.append('file', selectedFile)

      await updateWithUploadMutation.mutateAsync({
        bannerId: banner.id,
        formData,
      })
    } else {
      await updateMutation.mutateAsync({ bannerId: banner.id, data })
    }

    handleRemoveFile()
    onSuccess()
  }

  const handleClose = () => {
    if (!isPending) {
      handleRemoveFile()
      onCancel()
    }
  }

  // Get current image URL (either from existing banner or new file)
  const currentImageUrl = banner.imageMedia?.url || banner.imageUrl

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <div className="grid gap-4 py-4">
          {/* Type & Position */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại banner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANNER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANNER_POSITIONS.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Badge */}
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: Beauty Box" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: FLASH SALE" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mô tả chi tiết..."
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Highlight */}
          <FormField
            control={form.control}
            name="highlight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm nhấn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="VD: Mua 1 tặng 3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ctaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nút CTA</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: Mua ngay" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctaLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link CTA</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: /products/flash-sale" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sub Label */}
          <FormField
            control={form.control}
            name="subLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhãn phụ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="VD: Số lượng quà tặng có hạn"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gradient Colors */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gradientFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu gradient (từ)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="#FF6B9D" />
                      <input
                        type="color"
                        value={field.value || '#FF6B9D'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradientTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu gradient (đến)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="#FF8E53" />
                      <input
                        type="color"
                        value={field.value || '#FF8E53'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sort Order */}
          {/* <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Image Upload */}
          <ImageUploadDropzone
            value={selectedFile || currentImageUrl}
            onChange={setSelectedFile}
            onRemove={handleRemoveFile}
            label="Hình ảnh"
            maxSize={5}
            disabled={isPending}
          />

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2">
                <div className="space-y-0.5">
                  <FormLabel>Đang hoạt động</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" variant="primary-pink" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
