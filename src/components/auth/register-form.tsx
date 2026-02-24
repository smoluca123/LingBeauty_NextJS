'use client';
'use no memo';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterValues,
} from '@/lib/zod-schemas/auth.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/hooks/mutations/auth.mutation';
import LoadingButton from '@/components/ui/loading-button';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registerMutation = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
    mode: 'onTouched',
  });

  async function onSubmit(data: RegisterValues) {
    setError(null);
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        phone: data.phone,
      },
      {
        onSuccess: () => onSuccess?.(),
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nguyễn"
                    autoComplete="given-name"
                    className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Văn A"
                    autoComplete="family-name"
                    className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  autoComplete="username"
                  className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số điện thoại{' '}
                <span className="text-muted-foreground">(Tùy chọn)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="0123456789"
                  autoComplete="tel"
                  className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số hoặc ký tự
                đặc biệt
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <LoadingButton
          type="submit"
          className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
          loading={registerMutation.isPending}
        >
          Đăng ký
        </LoadingButton>
      </form>
    </Form>
  );
}
