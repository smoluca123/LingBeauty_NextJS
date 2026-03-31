'use client'
'use no memo'
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
import { Switch } from '@/components/ui/switch'
import {
  useCreateBannerMutation,
  useCreateBannerWithUploadMutation,
} from '@/hooks/mutations/admin-banner.mutation'
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import { DEFAULT_GRADIENT } from '@/app/admin/banners/constants'
import { ImageUploadDropzone } from '@/app/admin/components'
import { bannerSchema, type BannerFormValues } from '@/lib/schemas'
import { BannerFormFields } from './banner-form-fields'

interface BannerFormProps {
  /** Nếu có groups thì hiển thị select, nếu không thì dùng fixedGroupId */
  groups?: IBannerGroupDataType[]
  /** Group ID cố định (dùng khi tạo banner từ trong banner group) */
  fixedGroupId?: string
  /** Group ID mặc định khi có select */
  defaultGroupId?: string | null
  onSuccess: () => void
  onCancel: () => void
}

export function BannerForm({
  groups,
  fixedGroupId,
  defaultGroupId,
  onSuccess,
  onCancel,
}: BannerFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const createMutation = useCreateBannerMutation()
  const createWithUploadMutation = useCreateBannerWithUploadMutation()
  const isPending =
    createMutation.isPending || createWithUploadMutation.isPending

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      groupId: fixedGroupId || defaultGroupId || '',
      type: 'TEXT',
      position: 'MAIN_CAROUSEL',
      badge: '',
      title: '',
      description: '',
      highlight: '',
      ctaText: '',
      ctaLink: '',
      subLabel: '',
      gradientFrom: DEFAULT_GRADIENT.from,
      gradientTo: DEFAULT_GRADIENT.to,
      sortOrder: 0,
      isActive: true,
    },
  })

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const onSubmit = async (data: BannerFormValues) => {
    const targetGroupId = fixedGroupId || data.groupId

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
      formData.append('sortOrder', String(data.sortOrder))
      formData.append('isActive', String(data.isActive))
      formData.append('file', selectedFile)

      await createWithUploadMutation.mutateAsync({
        formData,
        groupId: targetGroupId,
      })
    } else {
      await createMutation.mutateAsync({
        ...data,
        groupId: targetGroupId,
      })
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

  // Ẩn gradient khi có ảnh được chọn
  const hasImage = !!selectedFile
  const showGradient = !hasImage

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <div className="grid gap-4 py-4">
          <BannerFormFields
            control={form.control}
            groups={groups}
            showGradient={showGradient}
          />

          {/* Sort Order */}
          <FormField
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
          />

          {/* Image Upload */}
          <ImageUploadDropzone
            value={selectedFile}
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
                Đang tạo...
              </>
            ) : (
              'Tạo banner'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
