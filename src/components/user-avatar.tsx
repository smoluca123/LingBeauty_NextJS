import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/utils';
import { IPropsWithClassName } from '@/lib/types/interfaces/utils.interfaces';

interface IProps extends IPropsWithClassName {
  fallbackName?: string;
  avatarUrl?: string;
}

export default function UserAvatar({
  avatarUrl,
  fallbackName = 'Anonymous',
  className,
}: IProps) {
  return (
    <Avatar className={cn('size-10', className)}>
      <AvatarFallback>{fallbackName[0].toLocaleUpperCase()}</AvatarFallback>
      <AvatarImage
        className="object-cover"
        src={avatarUrl || '/assets/images/avatar-placeholder.png'}
        alt={fallbackName}
      />
    </Avatar>
  );
}
