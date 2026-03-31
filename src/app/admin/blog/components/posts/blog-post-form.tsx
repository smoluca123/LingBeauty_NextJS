'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import {
  blogPostSchema,
  type BlogPostFormValues,
} from '@/lib/schemas/blog.schema'
import {
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
} from '@/hooks/mutations/blog.mutation'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { EditorWithPreview } from '@/components/tiptap-editor/editor-with-preview'
import { ImageUploadDropzone } from '@/app/admin/components'

interface BlogPostFormProps {
  post?: IBlogPostDataType
  topics: IBlogTopicDataType[]
  onClose: () => void
}

export function BlogPostForm({ post, topics, onClose }: BlogPostFormProps) {
  const isEdit = !!post
  const createMutation = useCreateBlogPostMutation()
  const updateMutation = useUpdateBlogPostMutation()
  const [tagInput, setTagInput] = useState('')

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title ?? '',
      content: post?.content ?? '',
      excerpt: post?.excerpt ?? '',
      topicId: post?.topicId ?? undefined,
      status: post?.status ?? BlogPostStatus.DRAFT,
      tags: post?.tags ?? [],
      metaTitle: post?.metaTitle ?? '',
      metaDescription: post?.metaDescription ?? '',
    },
  })

  const onSubmit = async (data: BlogPostFormValues) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: post.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onClose()
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.getValues('tags').includes(tag)) {
      form.setValue('tags', [...form.getValues('tags'), tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      form.getValues('tags').filter((tag) => tag !== tagToRemove),
    )
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề bài viết" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung *</FormLabel>
              <FormControl>
                <EditorWithPreview
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Nhập nội dung bài viết..."
                  availableHashtags={form.getValues('tags')}
                  showPreview={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Excerpt */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả ngắn" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Topic */}
          <FormField
            control={form.control}
            name="topicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chủ đề</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={BlogPostStatus.DRAFT}>Nháp</SelectItem>
                    <SelectItem value={BlogPostStatus.PUBLISHED}>
                      Đã xuất bản
                    </SelectItem>
                    <SelectItem value={BlogPostStatus.ARCHIVED}>
                      Lưu trữ
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tag và nhấn Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Thêm
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured Image */}
        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <ImageUploadDropzone
                value={value || post?.featuredImage?.url || null}
                onChange={onChange}
                label="Ảnh đại diện"
                maxSize={5}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SEO Fields */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">SEO</h3>
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Tối đa 60 ký tự" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tối đa 160 ký tự"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
