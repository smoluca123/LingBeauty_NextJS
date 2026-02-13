import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const recentUsers = [
  { name: 'Nguyễn Thị Mai', email: 'mai.nguyen@email.com', date: 'Hôm nay' },
  { name: 'Trần Văn Hùng', email: 'hung.tran@email.com', date: 'Hôm nay' },
  { name: 'Lê Thị Hoa', email: 'hoa.le@email.com', date: 'Hôm qua' },
  { name: 'Phạm Minh Tuấn', email: 'tuan.pham@email.com', date: 'Hôm qua' },
  { name: 'Võ Thị Lan', email: 'lan.vo@email.com', date: '2 ngày trước' },
];

export function RecentUsers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Người dùng mới</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          5 người dùng đăng ký gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm md:text-base truncate">
                  {user.name}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                {user.date}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
