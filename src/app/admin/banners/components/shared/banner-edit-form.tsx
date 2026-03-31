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
import { Switch } from '@/components/ui/switch'
import {
  useUpdateBannerMutation,
  useUpdateBannerWithUploadMutation,
} from '@/hooks/mutations/admin-banner.mutation'
import type { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import { DEFAULT_GRADIENT } from '@/app/admin/banners/constants'
import { ImageUploadDropzone } from '@/app/admin/components'
import { bannerEditSchema, type BannerEditFormValues } from '@/lib/schemas'
import { BannerFormFields } from './banner-form-fields'

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

  // Ẩn gradient khi có ảnh (từ banner hiện tại hoặc file mới)
  const hasImage = !!selectedFile || !!currentImageUrl
  const showGradient = !hasImage

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <div className="grid gap-4 py-4">
          <BannerFormFields
            control={form.control}
            showGradient={showGradient}
          />

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
