import { AccountForm } from '../components';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Tài khoản</h1>
      <AccountForm />
    </div>
  );
}
