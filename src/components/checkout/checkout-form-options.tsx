'use client'

import { MapPin, CreditCard, ChevronRight, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetMyAddressesQuery } from '@/hooks/querys/address.query'
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces'
import type { PaymentMethod } from '@/lib/types/interfaces/apis/order.interfaces'
import Link from 'next/link'
import { cn } from '@/lib/utils/style-utils'

interface CheckoutFormOptionsProps {
  selectedAddressId: string | null
  onAddressChange: (id: string) => void
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
}

export function CheckoutFormOptions({
  selectedAddressId,
  onAddressChange,
  paymentMethod,
  onPaymentMethodChange,
}: CheckoutFormOptionsProps) {
  const { data, isLoading } = useGetMyAddressesQuery({ limit: 10 })
  const addresses = data?.data.items ?? []

  return (
    <div className="space-y-6">
      {/* 1. Địa chỉ giao hàng */}
      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-pink/10 p-2 rounded-full">
              <MapPin className="w-5 h-5 text-primary-pink" />
            </div>
            <h2 className="text-xl font-semibold">1. Địa chỉ giao hàng</h2>
          </div>
          <Link href="/profile/addresses">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-pink gap-1"
            >
              <Plus className="h-4 w-4" />
              Thêm địa chỉ
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="mb-3">Bạn chưa có địa chỉ nào.</p>
            <Link href="/profile/addresses">
              <Button
                variant="outline"
                size="sm"
                className="border-primary-pink text-primary-pink"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm địa chỉ mới
              </Button>
            </Link>
          </div>
        ) : (
          <RadioGroup
            value={selectedAddressId ?? ''}
            onValueChange={onAddressChange}
            className="space-y-3"
          >
            {addresses.map((address) => (
              <AddressOption
                key={address.id}
                address={address}
                isSelected={selectedAddressId === address.id}
              />
            ))}
          </RadioGroup>
        )}
      </Card>

      {/* 2. Phương thức thanh toán */}
      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-pink/10 p-2 rounded-full">
            <CreditCard className="w-5 h-5 text-primary-pink" />
          </div>
          <h2 className="text-xl font-semibold">2. Phương thức thanh toán</h2>
        </div>

        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
          className="space-y-3"
        >
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.value}
              className={cn(
                'flex items-center justify-between border p-4 rounded-lg transition-colors cursor-pointer',
                paymentMethod === method.value
                  ? 'border-primary-pink bg-primary-pink/5'
                  : 'border-gray-200 hover:border-primary-pink/40',
              )}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={method.value} id={method.value} />
                <Label
                  htmlFor={method.value}
                  className="font-medium cursor-pointer"
                >
                  {method.label}
                  <span className="block text-sm font-normal text-gray-500 mt-0.5">
                    {method.description}
                  </span>
                </Label>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </RadioGroup>
      </Card>
    </div>
  )
}

function AddressOption({
  address,
  isSelected,
}: {
  address: IAddressDataType
  isSelected: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 border p-4 rounded-lg transition-colors cursor-pointer',
        isSelected
          ? 'border-primary-pink bg-primary-pink/5'
          : 'border-gray-200 hover:border-primary-pink/40',
      )}
    >
      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
      <Label htmlFor={address.id} className="cursor-pointer flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">{address.fullName}</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">{address.phone}</span>
          {address.isDefault && (
            <span className="text-[10px] font-bold text-primary-pink border border-primary-pink rounded px-1.5 py-0.5">
              Mặc định
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ''}
          {`, ${address.city}, ${address.province}`}
        </p>
      </Label>
    </div>
  )
}

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  description: string
}[] = [
  {
    value: 'COD',
    label: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi hàng được giao đến.',
  },
  {
    value: 'BANK_TRANSFER',
    label: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản nhanh 24/7 qua QR Code.',
  },
]
