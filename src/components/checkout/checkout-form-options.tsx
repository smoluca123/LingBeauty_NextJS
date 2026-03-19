"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Truck, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CheckoutFormOptions() {
  return (
    <div className="space-y-6">
      {/* 1. Thông tin giao hàng */}
      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-pink/10 p-2 rounded-full">
            <MapPin className="w-5 h-5 text-primary-pink" />
          </div>
          <h2 className="text-xl font-semibold">1. Thông tin giao hàng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">Họ và tên</Label>
            <Input id="fullname" placeholder="Nhập họ và tên đầy đủ" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" placeholder="Nhập số điện thoại của bạn" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input id="address" placeholder="Số nhà, Tên đường, Phường/Xã..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh / Thành phố</Label>
            <Input id="province" placeholder="Chọn tỉnh/thành phố" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">Quận / Huyện</Label>
            <Input id="district" placeholder="Chọn quận/huyện" />
          </div>
        </div>
      </Card>

      {/* 2. Phương thức vận chuyển */}
      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-pink/10 p-2 rounded-full">
            <Truck className="w-5 h-5 text-primary-pink" />
          </div>
          <h2 className="text-xl font-semibold">2. Phương thức vận chuyển</h2>
        </div>

        <RadioGroup defaultValue="standard" className="space-y-3">
          <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="font-medium cursor-pointer">
                Giao hàng tiêu chuẩn
                <span className="block text-sm font-normal text-gray-500 mt-1">Dự kiến giao: 2-4 ngày làm việc</span>
              </Label>
            </div>
            <span className="font-semibold text-gray-900">Miễn phí</span>
          </div>

          <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express" className="font-medium cursor-pointer">
                Giao hàng hỏa tốc
                <span className="block text-sm font-normal text-gray-500 mt-1">Giao trong 2 giờ (Chỉ áp dụng nội thành HCM)</span>
              </Label>
            </div>
            <span className="font-semibold text-gray-900">40.000 ₫</span>
          </div>
        </RadioGroup>
      </Card>

      {/* 3. Phương thức thanh toán */}
      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-pink/10 p-2 rounded-full">
            <CreditCard className="w-5 h-5 text-primary-pink" />
          </div>
          <h2 className="text-xl font-semibold">3. Phương thức thanh toán</h2>
        </div>

        <RadioGroup defaultValue="cod" className="space-y-3">
          <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="font-medium cursor-pointer">
                Thanh toán khi nhận hàng (COD)
                <span className="block text-sm font-normal text-gray-500 mt-1">Thanh toán bằng tiền mặt khi hàng được giao đến.</span>
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="banking" id="banking" />
              <Label htmlFor="banking" className="font-medium cursor-pointer">
                Chuyển khoản ngân hàng
                <span className="block text-sm font-normal text-gray-500 mt-1">Chuyển khoản nhanh 24/7 qua QR Code.</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
}
