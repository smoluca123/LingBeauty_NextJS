'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = 'login',
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-br from-primary-pink/5 to-transparent">
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === 'login'
              ? 'Đăng nhập để tiếp tục mua sắm'
              : 'Đăng ký để trải nghiệm mua sắm tốt nhất'}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl h-11 p-1">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-primary-pink data-[state=active]:text-white font-medium"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg data-[state=active]:bg-primary-pink data-[state=active]:text-white font-medium"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t text-center text-sm text-muted-foreground">
          Bằng cách đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
          <button className="text-primary-pink hover:underline">
            Điều khoản dịch vụ
          </button>{' '}
          và{' '}
          <button className="text-primary-pink hover:underline">
            Chính sách bảo mật
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
