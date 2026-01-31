'use client';

import { useState } from 'react';
import {
  Ticket,
  Truck,
  Gift,
  Coins,
  Copy,
  Check,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  OFFER_TYPE_LABELS,
  OFFER_TYPE_COLORS,
  formatCurrency,
  isOfferExpiringSoon,
  type Offer,
  type OfferType,
} from '../../offers/_data/mock-offers';

// ============ Constants ============
const OFFER_TYPE_ICONS: Record<OfferType, React.ReactNode> = {
  discount: <Ticket className="h-5 w-5" />,
  freeship: <Truck className="h-5 w-5" />,
  gift: <Gift className="h-5 w-5" />,
  cashback: <Coins className="h-5 w-5" />,
};

// ============ Offer Card Component ============
interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpiringSoon = isOfferExpiringSoon(offer.expiresAt);
  const isDisabled = offer.status !== 'active';

  const expiryDate = new Date(offer.expiresAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isDisabled ? 'opacity-60' : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Left - Icon Section */}
          <div
            className={`flex w-24 shrink-0 items-center justify-center ${
              isDisabled
                ? 'bg-muted'
                : 'bg-linear-to-br from-primary-pink to-primary-pink/70'
            }`}
          >
            <div className={`${isDisabled ? 'text-muted-foreground' : 'text-white'}`}>
              {OFFER_TYPE_ICONS[offer.type]}
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge
                    className={`${OFFER_TYPE_COLORS[offer.type]} border-0 text-xs`}
                  >
                    {OFFER_TYPE_LABELS[offer.type]}
                  </Badge>
                  {isExpiringSoon && offer.status === 'active' && (
                    <Badge
                      variant="outline"
                      className="text-xs text-orange-600 border-orange-300 gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      Sắp hết hạn
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-foreground">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {offer.description}
                </p>

                {/* Conditions */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Đơn tối thiểu: {formatCurrency(offer.minOrderValue)}</span>
                  {offer.maxDiscount && (
                    <span>Giảm tối đa: {formatCurrency(offer.maxDiscount)}</span>
                  )}
                </div>

                {/* Usage Info */}
                {offer.usageLimit > 1 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    Đã dùng {offer.usedCount}/{offer.usageLimit} lượt
                  </div>
                )}

                {/* Expiry */}
                <p className="text-xs text-muted-foreground mt-2">
                  {offer.status === 'expired'
                    ? 'Đã hết hạn'
                    : offer.status === 'used'
                    ? 'Đã sử dụng'
                    : `HSD: ${expiryDate}`}
                </p>
              </div>
            </div>

            {/* Code & Copy Button */}
            {offer.status === 'active' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono font-semibold">
                  {offer.code}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Đã sao
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Sao mã
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
