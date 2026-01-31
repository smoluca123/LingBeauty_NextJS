// Mock data for Addresses page
export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  type: 'home' | 'office' | 'other';
}

export const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Nguyễn Huệ',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: true,
    type: 'home',
  },
  {
    id: '2',
    name: 'Nguyễn Văn A',
    phone: '0907654321',
    address: 'Tầng 15, Tòa nhà Bitexco Financial Tower',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: false,
    type: 'office',
  },
  {
    id: '3',
    name: 'Trần Thị B',
    phone: '0912345678',
    address: '456 Lê Lợi',
    ward: 'Phường 7',
    district: 'Quận 3',
    city: 'TP. Hồ Chí Minh',
    isDefault: false,
    type: 'other',
  },
];

export const ADDRESS_TYPE_LABELS: Record<Address['type'], string> = {
  home: 'Nhà riêng',
  office: 'Văn phòng',
  other: 'Khác',
};

export function getFullAddress(address: Address): string {
  return `${address.address}, ${address.ward}, ${address.district}, ${address.city}`;
}
