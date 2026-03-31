'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import {
  blogTopicSchema,
  type BlogTopicFormValues,
} from '@/lib/schemas/blog.schema'
import {
  useCreateBlogTopicMutation,
  useCreateSubTopicMutation,
  useUpdateBlogTopicMutation,
} from '@/hooks/mutations/blog.mutation'
import type { IBlogTopicDataType } from '@/lib/types/interfaces/apis/blog.interfaces'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploadDropzone } from '@/app/admin/components'

interface BlogTopicFormProps {
  topic?: IBlogTopicDataType
  topics: IBlogTopicDataType[]
  onClose: () => void
  parentTopic?: IBlogTopicDataType | null
}

export function BlogTopicForm({
  topic,
  topics,
  onClose,
  parentTopic,
}: BlogTopicFormProps) {
  const isEdit = !!topic
  const createMutation = useCreateBlogTopicMutation()
  const createSubTopicMutation = useCreateSubTopicMutation()
  const updateMutation = useUpdateBlogTopicMutation()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<BlogTopicFormValues>({
    resolver: zodResolver(blogTopicSchema),
    defaultValues: {
      name: topic?.name ?? '',
      description: topic?.description ?? '',
      parentId: topic?.parentId ?? parentTopic?.id ?? undefined,
      sortOrder: topic?.sortOrder ?? 0,
      isActive: topic?.isActive ?? true,
    },
  })

  const onSubmit = async (data: BlogTopicFormValues) => {
    // Mutation sẽ tự động xử lý upload ảnh trong onSuccess
    if (isEdit) {
      await updateMutation.mutateAsync({ id: topic.id, data })
    } else {
      // Nếu có parentId thì gọi API tạo sub-topic, không có thì tạo topic chính
      if (data.parentId) {
        const { parentId, ...subTopicData } = data
        await createSubTopicMutation.mutateAsync({
          parentId,
          data: subTopicData,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
    }

    onClose()
  }

  const isPending =
    createMutation.isPending ||
    createSubTopicMutation.isPending ||
    updateMutation.isPending

  // Filter out current topic and its children from parent options
  const availableParents = topics.filter((t) => t.id !== topic?.id)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên chủ đề *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên chủ đề" {...field} />
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
                <Textarea placeholder="Nhập mô tả chủ đề" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parent Topic - Only show when creating new topic */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chủ đề cha</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === 'none' ? undefined : value)
                  }
                  value={field.value || 'none'}
                  disabled={!!parentTopic}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Không có (Chủ đề gốc)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Không có (Chủ đề gốc)</SelectItem>
                    {availableParents.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {parentTopic
                    ? `Chủ đề con của "${parentTopic.name}"`
                    : 'Chọn chủ đề cha nếu muốn tạo chủ đề con'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Sort Order */}
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự sắp xếp</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange } }) => (
            <FormItem>
              <ImageUploadDropzone
                value={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : topic?.imageMedia?.url || null
                }
                onChange={(newValue) => {
                  if (newValue instanceof File) {
                    setSelectedFile(newValue)
                    onChange(newValue)
                  } else if (typeof newValue === 'string') {
                    setSelectedFile(null)
                    onChange(newValue)
                  } else {
                    setSelectedFile(null)
                    onChange(null)
                  }
                }}
                label="Hình ảnh chủ đề"
                maxSize={5}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Active */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Trạng thái hoạt động
                </FormLabel>
                <FormDescription>
                  Chủ đề sẽ hiển thị trên website khi được kích hoạt
                </FormDescription>
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

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending} variant="primary-pink">
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
