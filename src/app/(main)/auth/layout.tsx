import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-full flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-purple-50 p-4">
      {children}
    </div>
  );
}
