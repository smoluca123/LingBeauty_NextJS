'use client';
'use no memo';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginValues } from '@/lib/zod-schemas/auth.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
    mode: 'onTouched',
  });

  async function onSubmit(data: LoginValues) {
    setError(null);
    try {
      await login({
        email: data.usernameOrEmail,
        password: data.password,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email hoặc tên người dùng</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com hoặc username"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
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

        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="link"
            className="text-primary-pink hover:text-primary-pink/80 p-0 h-auto"
          >
            Quên mật khẩu?
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
      </form>
    </Form>
  );
}
