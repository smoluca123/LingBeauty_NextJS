import { Suspense } from 'react';
import { UsersContent } from './components';

export default function AdminUsersPage() {
  return <Suspense>
    <UsersContent />
  </Suspense>;
}
