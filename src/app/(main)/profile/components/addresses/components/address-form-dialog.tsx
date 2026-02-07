'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { VIETNAM_LOCATIONS } from '../../../addresses/_data/vietnam-locations';
import type { Address } from '../../../addresses/_data/mock-addresses';

// Form validation schema
const addressFormSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  city: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  district: z.string().min(1, 'Vui lòng chọn Quận/Huyện'),
  ward: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
  type: z.enum(['home', 'office', 'other']),
  isDefault: z.boolean().optional().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Address, 'id'>) => void;
  editAddress?: Address | null;
}

export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editAddress,
}: AddressFormDialogProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const form = useForm<AddressFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addressFormSchema) as any,
    defaultValues: editAddress
      ? {
          name: editAddress.name,
          phone: editAddress.phone,
          address: editAddress.address,
          city: editAddress.city,
          district: editAddress.district,
          ward: editAddress.ward,
          type: editAddress.type,
          isDefault: editAddress.isDefault,
        }
      : {
          name: '',
          phone: '',
          address: '',
          city: '',
          district: '',
          ward: '',
          type: 'home',
          isDefault: false,
        },
  });

  // Get available districts based on selected province
  const availableDistricts =
    VIETNAM_LOCATIONS.find((p) => p.name === selectedProvince)?.districts || [];

  // Get available wards based on selected district
  const availableWards =
    availableDistricts.find((d) => d.name === selectedDistrict)?.wards || [];

  // Handle province change
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    form.setValue('city', value);
    form.setValue('district', '');
    form.setValue('ward', '');
  };

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    form.setValue('district', value);
    form.setValue('ward', '');
  };

  // Handle form submission
  const handleSubmit = (data: AddressFormValues) => {
    console.log('📝 Form submitted:', data);
    // Ensure isDefault is always a boolean
    const submissionData = {
      ...data,
      isDefault: data.isDefault ?? false,
    };
    onSubmit(submissionData);
    form.reset();
    setSelectedProvince('');
    setSelectedDistrict('');
    onOpenChange(false);
  };

  // Handle dialog close
  const handleClose = () => {
    form.reset();
    setSelectedProvince('');
    setSelectedDistrict('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </DialogTitle>
          <DialogDescription>
            Vui lòng điền đầy đủ thông tin địa chỉ giao hàng
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Thông tin liên hệ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Địa chỉ giao hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Province/City Select */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleProvinceChange(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VIETNAM_LOCATIONS.map((province) => (
                            <SelectItem key={province.id} value={province.name}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* District Select */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quận/Huyện</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleDistrictChange(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                        disabled={!selectedProvince}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Quận/Huyện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDistricts.map((district) => (
                            <SelectItem key={district.id} value={district.name}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ward Select */}
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phường/Xã</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedDistrict}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Phường/Xã" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableWards.map((ward) => (
                            <SelectItem key={ward.id} value={ward.name}>
                              {ward.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Street Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ cụ thể</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số nhà, tên đường..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Type */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Loại địa chỉ
              </h3>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home" className="cursor-pointer">
                            Nhà riêng
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office" className="cursor-pointer">
                            Văn phòng
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="cursor-pointer">
                            Khác
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Set as Default */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Đặt làm địa chỉ mặc định
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-full"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-primary-pink hover:bg-primary-pink/90"
              >
                {editAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
