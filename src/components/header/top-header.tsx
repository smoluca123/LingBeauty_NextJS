import { ClockIcon, GiftIcon, RotateCcwIcon, TruckIcon } from 'lucide-react';

const topHeaderItems = [
  {
    label: 'Freeship 15K mọi đơn hàng',
    icon: <TruckIcon className="w-4 h-4" />,
  },
  {
    label: 'Quà Tặng Cho Đơn Từ 499K',
    icon: <GiftIcon className="w-4 h-4" />,
  },
  {
    label: 'Giao Hàng Nhanh 24H',
    icon: <ClockIcon className="w-4 h-4" />,
  },
  {
    label: 'Đổi Trả Dễ Dàng',
    icon: <RotateCcwIcon className="w-4 h-4" />,
  },
];
export default function TopHeader() {
  return (
    <div className="bg-primary-pink text-white py-1 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
          {topHeaderItems.map((item, index) => (
            <div key={item.label} className="contents">
              <div className="flex items-center gap-x-2">
                {item.icon}
                <span className="text-xs md:text-sm whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {index < topHeaderItems.length - 1 && (
                <span className="text-white text-xs hidden lg:inline">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
