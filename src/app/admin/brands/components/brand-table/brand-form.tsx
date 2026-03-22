'use client';

import { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ImageIcon, X } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RichTextField } from '@/components/form/rich-text-field';
import type { IBrandFormData } from '@/lib/types/interfaces/apis/admin-brand.interfaces';

interface BrandFormProps {
  form: UseFormReturn<IBrandFormData>;
  /** Preview URL được quản lý bởi component cha bằng useState */
  logoPreview: string | null;
  onLogoChange: (file: File, previewUrl: string) => void;
  onLogoRemove: () => void;
}

export function BrandForm({
  form,
  logoPreview,
  onLogoChange,
  onLogoRemove,
}: BrandFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onLogoChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onLogoRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className='space-y-4'>
      {/* Name */}
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên thương hiệu *</FormLabel>
            <FormControl>
              <Input placeholder='Nhập tên thương hiệu' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <RichTextField
        control={form.control}
        name='description'
        label='Mô tả'
        placeholder='Mô tả thương hiệu (tuỳ chọn)'
        availableHashtags={['thương hiệu', 'brand', 'chính hãng', 'uy tín']}
      />

      {/* Website */}
      <FormField
        control={form.control}
        name='website'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input type='url' placeholder='https://example.com' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Logo upload */}
      <FormItem>
        <FormLabel>Logo thương hiệu</FormLabel>
        <div className='space-y-2'>
          {logoPreview ? (
            <div className='relative w-24 h-24 rounded-md overflow-hidden border'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoPreview}
                alt='Logo preview'
                className='w-full h-full object-cover'
              />
              <button
                type='button'
                onClick={handleRemoveLogo}
                className='absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5'
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className='flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50 transition-colors'
            >
              <ImageIcon className='h-6 w-6 text-muted-foreground' />
              <span className='text-xs text-muted-foreground mt-1'>
                Chọn ảnh
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileChange}
          />
          {!logoPreview && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
            >
              Tải logo lên
            </Button>
          )}
        </div>
      </FormItem>

      {/* isActive */}
      <FormField
        control={form.control}
        name='isActive'
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border p-3'>
            <div>
              <FormLabel className='text-sm font-medium'>Kích hoạt</FormLabel>
              <p className='text-xs text-muted-foreground'>
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
  );
}
