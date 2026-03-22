'use client';

import { EditorWithPreview } from '@/components/tiptap-editor';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface RichTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  description?: string;
  availableHashtags?: string[];
  required?: boolean;
  className?: string;
}

/**
 * Form field component với Tiptap rich text editor và preview
 * Dùng để thay thế Textarea cho các field cần rich text formatting
 * 
 * @example
 * ```tsx
 * <RichTextField
 *   control={form.control}
 *   name="description"
 *   label="Mô tả"
 *   placeholder="Nhập mô tả..."
 *   availableHashtags={['tag1', 'tag2']}
 * />
 * ```
 */
export function RichTextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  description,
  availableHashtags,
  required,
  className,
}: RichTextFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <EditorWithPreview
              value={field.value || ''}
              onChange={field.onChange}
              placeholder={placeholder}
              availableHashtags={availableHashtags}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
