'use client';
'use no memo';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  useVietnameseProvinces,
  type ApiVersion,
  isProvinceV1,
  isProvinceV2,
} from '@/hooks/useVietnameseProvinces';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  addressFormSchema,
  AddressFormValues,
} from '@/lib/zod-schemas/addresses.schema';

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormValues) => void | Promise<void>;
  editAddress?: IAddressDataType | null;
  isSubmitting?: boolean;
}

export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editAddress,
  isSubmitting = false,
}: AddressFormDialogProps) {
  const [apiVersion] = useState<ApiVersion>('v1');
  const { provinces, loading: loadingProvinces } = useVietnameseProvinces({
    version: apiVersion,
  });
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const form = useForm<AddressFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addressFormSchema) as any,
    defaultValues: editAddress
      ? {
          fullName: editAddress.fullName,
          phone: editAddress.phone,
          addressLine1: editAddress.addressLine1,
          addressLine2: editAddress.addressLine2 || '',
          city: editAddress.city,
          province: editAddress.province,
          postalCode: editAddress.postalCode,
          type: editAddress.type,
          isDefault: editAddress.isDefault,
        }
      : {
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          province: '',
          postalCode: '',
          type: 'HOME',
          isDefault: false,
        },
  });

  // Get available districts based on selected province (v1 only)
  const availableDistricts = (() => {
    const province = provinces.find((p) => p.name === selectedProvince);
    if (!province || !isProvinceV1(province)) {
      return [];
    }
    return province.districts;
  })();

  // Get available wards based on API version
  const availableWards = (() => {
    const province = provinces.find((p) => p.name === selectedProvince);
    if (!province) return [];

    // V2: wards directly in province
    if (isProvinceV2(province)) {
      return province.wards;
    }

    // V1: wards in districts
    if (isProvinceV1(province)) {
      const district = province.districts.find(
        (d) => d.name === selectedDistrict,
      );
      return district?.wards || [];
    }

    return [];
  })();

  // Reset form values when editAddress changes or dialog opens
  useEffect(() => {
    if (open) {
      if (editAddress) {
        // Editing mode: populate form with existing data
        form.reset({
          fullName: editAddress.fullName,
          phone: editAddress.phone,
          addressLine1: editAddress.addressLine1,
          addressLine2: editAddress.addressLine2 || '',
          city: editAddress.city,
          province: editAddress.province,
          postalCode: editAddress.postalCode,
          type: editAddress.type,
          isDefault: editAddress.isDefault,
        });
        // Set local state for dropdowns
        setSelectedProvince(editAddress.province);
        setSelectedDistrict(editAddress.city);
      } else {
        // Add mode: reset to default values
        form.reset({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          province: '',
          postalCode: '',
          type: 'HOME',
          isDefault: false,
        });
        setSelectedProvince('');
        setSelectedDistrict('');
      }
    }
  }, [editAddress, open, form]);

  // Handle province change
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    form.setValue('province', value);
    form.setValue('city', '');
    form.setValue('postalCode', '');
  };

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    form.setValue('city', value);
    form.setValue('postalCode', '');
  };

  // Handle version change - reset selections
  // const handleVersionChange = (newVersion: ApiVersion) => {
  //   setApiVersion(newVersion);
  //   setSelectedProvince('');
  //   setSelectedDistrict('');
  //   form.setValue('city', '');
  //   form.setValue('district', '');
  //   form.setValue('ward', '');
  // };

  // Handle form submission
  const handleSubmit = async (data: AddressFormValues) => {
    try {
      console.log('📝 Form submitted:', data);
      // Ensure isDefault is always a boolean
      const submissionData = {
        ...data,
        isDefault: data.isDefault ?? false,
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error('📝 Form submission failed:', error);
    } finally {
      form.reset();
      setSelectedProvince('');
      setSelectedDistrict('');
    }
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

        <Form {...form} key={apiVersion}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Thông tin liên hệ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Địa chỉ giao hàng
                </h3>
                {/* API Version Selector */}
                {/* <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Dữ liệu:
                  </Label>
                  <div className="flex rounded-md border">
                    <button
                      type="button"
                      onClick={() => handleVersionChange('v1')}
                      className={`px-3 py-1 text-xs transition-colors ${
                        apiVersion === 'v1'
                          ? 'bg-primary-pink text-white'
                          : 'bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Trước 07/2025
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVersionChange('v2')}
                      className={`px-3 py-1 text-xs transition-colors ${
                        apiVersion === 'v2'
                          ? 'bg-primary-pink text-white'
                          : 'bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Sau 07/2025
                    </button>
                  </div>
                </div> */}
              </div>

              <div className="space-y-4">
                {/* Province/City Select */}
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleProvinceChange(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingProvinces ? (
                            <SelectItem value="loading" disabled>
                              Đang tải dữ liệu...
                            </SelectItem>
                          ) : (
                            provinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.name}
                              >
                                {province.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div
                  className={`grid grid-cols-1 gap-4 ${apiVersion === 'v1' ? 'md:grid-cols-2' : ''}`}
                >
                  {/* District Select - Only show for v1 */}
                  {apiVersion === 'v1' && (
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-full">
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
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn Quận/Huyện" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableDistricts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={district.name}
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Ward Select */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Phường/Xã</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={
                            !selectedProvince ||
                            (apiVersion === 'v1' && !selectedDistrict)
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full ">
                              <SelectValue placeholder="Chọn Phường/Xã" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableWards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.name}>
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
                {/* District Select */}
              </div>

              {/* Street Address */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ cụ thể</FormLabel>
                    <FormControl>
                      <Input placeholder="Số nhà, tên đường..." {...field} />
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
                          <RadioGroupItem value="HOME" id="HOME" />
                          <Label htmlFor="HOME" className="cursor-pointer">
                            Nhà riêng
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="OFFICE" id="OFFICE" />
                          <Label htmlFor="OFFICE" className="cursor-pointer">
                            Văn phòng
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="OTHER" id="OTHER" />
                          <Label htmlFor="OTHER" className="cursor-pointer">
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
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-primary-pink hover:bg-primary-pink/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang xử lý...
                  </>
                ) : (
                  <>{editAddress ? 'Cập nhật' : 'Thêm địa chỉ'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
