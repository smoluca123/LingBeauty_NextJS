'use client';

import {
  MapPin,
  Phone,
  Home,
  Building2,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ADDRESS_TYPE_LABELS,
  getFullAddress,
  type Address,
} from '../../addresses/_data/mock-addresses';

// ============ Address Type Icons ============
const ADDRESS_TYPE_ICONS: Record<Address['type'], React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  office: <Building2 className="h-4 w-4" />,
  other: <MapPin className="h-4 w-4" />,
};

// ============ Address Card Component ============
interface AddressCardProps {
  address: Address;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        address.isDefault
          ? 'border-primary-pink ring-1 ring-primary-pink/20'
          : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Info */}
          <div className="flex-1 space-y-2">
            {/* Name & Default Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">
                {address.name}
              </span>
              {address.isDefault && (
                <Badge className="bg-primary-pink/10 text-primary-pink border-0 text-xs">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Mặc định
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-xs gap-1 text-muted-foreground"
              >
                {ADDRESS_TYPE_ICONS[address.type]}
                {ADDRESS_TYPE_LABELS[address.type]}
              </Badge>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{address.phone}</span>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{getFullAddress(address)}</span>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!address.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(address.id)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Đặt làm mặc định
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(address.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(address.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
