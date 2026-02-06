// Simple mock data for Vietnam locations (3-level: Province -> District -> Ward)

export interface Ward {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  wards: Ward[];
}

export interface Province {
  id: string;
  name: string;
  districts: District[];
}

export const VIETNAM_LOCATIONS: Province[] = [
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    districts: [
      {
        id: 'q1',
        name: 'Quận 1',
        wards: [
          { id: 'bn', name: 'Phường Bến Nghé' },
          { id: 'bt', name: 'Phường Bến Thành' },
          { id: 'cg', name: 'Phường Cô Giang' },
          { id: 'dn', name: 'Phường Đa Kao' },
        ],
      },
      {
        id: 'q3',
        name: 'Quận 3',
        wards: [
          { id: 'p1', name: 'Phường 1' },
          { id: 'p2', name: 'Phường 2' },
          { id: 'p3', name: 'Phường 3' },
          { id: 'p7', name: 'Phường 7' },
        ],
      },
      {
        id: 'td',
        name: 'Quận Thủ Đức',
        wards: [
          { id: 'ltt', name: 'Phường Linh Trung' },
          { id: 'ltd', name: 'Phường Linh Đông' },
          { id: 'ltc', name: 'Phường Linh Chiểu' },
        ],
      },
    ],
  },
  {
    id: 'hn',
    name: 'Hà Nội',
    districts: [
      {
        id: 'hk',
        name: 'Quận Hoàn Kiếm',
        wards: [
          { id: 'hg', name: 'Phường Hàng Gai' },
          { id: 'hb', name: 'Phường Hàng Bạc' },
          { id: 'ht', name: 'Phường Hàng Trống' },
        ],
      },
      {
        id: 'bd',
        name: 'Quận Ba Đình',
        wards: [
          { id: 'dt', name: 'Phường Điện Biên' },
          { id: 'db', name: 'Phường Đội Cấn' },
          { id: 'kl', name: 'Phường Kim Mã' },
        ],
      },
    ],
  },
  {
    id: 'dn',
    name: 'Đà Nẵng',
    districts: [
      {
        id: 'hc',
        name: 'Quận Hải Châu',
        wards: [
          { id: 'tc', name: 'Phường Thạch Thang' },
          { id: 'ht', name: 'Phường Hải Châu 1' },
          { id: 'ht2', name: 'Phường Hải Châu 2' },
        ],
      },
      {
        id: 'sk',
        name: 'Quận Sơn Trà',
        wards: [
          { id: 'mn', name: 'Phường Mân Thái' },
          { id: 'nc', name: 'Phường Nại Hiên Đông' },
        ],
      },
    ],
  },
];
