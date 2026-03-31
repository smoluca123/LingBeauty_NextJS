'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import { BANNER_TYPES, BANNER_POSITIONS } from '@/app/admin/banners/constants'

interface BannerFormFieldsProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  groups?: IBannerGroupDataType[]
  showGradient?: boolean
}

export function BannerFormFields<T extends FieldValues = FieldValues>({
  control,
  groups,
  showGradient = true,
}: BannerFormFieldsProps<T>) {
  return (
    <>
      {/* Group Selection */}
      {groups && (
        <FormField
          control={control}
          name={'groupId' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhóm banner</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhóm banner (không bắt buộc)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Type & Position */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={'type' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại banner</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={control}
          name={'position' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vị trí</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        control={control}
        name={'badge' as Path<T>}
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
        control={control}
        name={'title' as Path<T>}
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
        control={control}
        name={'description' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Mô tả chi tiết..." rows={2} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Highlight */}
      <FormField
        control={control}
        name={'highlight' as Path<T>}
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
          control={control}
          name={'ctaText' as Path<T>}
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
          control={control}
          name={'ctaLink' as Path<T>}
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
        control={control}
        name={'subLabel' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nhãn phụ</FormLabel>
            <FormControl>
              <Input {...field} placeholder="VD: Số lượng quà tặng có hạn" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gradient Colors - chỉ hiển thị khi showGradient = true */}
      {showGradient && (
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name={'gradientFrom' as Path<T>}
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
            control={control}
            name={'gradientTo' as Path<T>}
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
      )}
    </>
  )
}
